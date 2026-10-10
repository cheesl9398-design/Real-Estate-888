import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Firestore
} from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { db, auth } from './config';
import { Property, Inquiry } from '../types/property';
import { INITIAL_PROPERTIES } from '../data/initialProperties';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  authClient: Auth | null = auth
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authClient?.currentUser?.uid || null,
      email: authClient?.currentUser?.email || null,
      emailVerified: authClient?.currentUser?.emailVerified || null,
      isAnonymous: authClient?.currentUser?.isAnonymous || null,
      tenantId: authClient?.currentUser?.tenantId || null,
      providerInfo: authClient?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const LOCAL_PROPERTIES_KEY = 'estateguru_properties_v2';
const LOCAL_INQUIRIES_KEY = 'estateguru_inquiries_v2';

export function getLocalProperties(): Property[] {
  try {
    const raw = localStorage.getItem(LOCAL_PROPERTIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed reading local properties', e);
  }
  // Initialize with initial properties
  localStorage.setItem(LOCAL_PROPERTIES_KEY, JSON.stringify(INITIAL_PROPERTIES));
  return INITIAL_PROPERTIES;
}

export function saveLocalProperties(props: Property[]): void {
  localStorage.setItem(LOCAL_PROPERTIES_KEY, JSON.stringify(props));
}

export function getLocalInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(LOCAL_INQUIRIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed reading local inquiries', e);
  }
  return [];
}

export function saveLocalInquiries(inquiries: Inquiry[]): void {
  localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(inquiries));
}

// Fetch all properties from Firestore with local fallback
export async function fetchPropertiesFromFirestore(firestore: Firestore | null): Promise<Property[]> {
  if (!firestore) {
    return getLocalProperties();
  }

  const path = 'properties';
  try {
    const colRef = collection(firestore, path);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // If collection is empty in Firestore, seed it from initial data
      const local = getLocalProperties();
      for (const item of local) {
        try {
          await setDoc(doc(firestore, path, item.id), item);
        } catch {
          // If seeding fails due to rules, fallback quietly
        }
      }
      return local;
    }
    const list: Property[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ ...(docSnap.data() as Property), id: docSnap.id });
    });
    saveLocalProperties(list);
    return list;
  } catch (error) {
    console.warn('Firestore fetch failed, using local cache:', error);
    return getLocalProperties();
  }
}

// Save or create a property
export async function persistProperty(property: Property, firestore: Firestore | null): Promise<void> {
  // Always update local cache first for instant responsiveness
  const current = getLocalProperties();
  const index = current.findIndex(p => p.id === property.id);
  if (index >= 0) {
    current[index] = property;
  } else {
    current.unshift(property);
  }
  saveLocalProperties(current);

  if (firestore) {
    const path = `properties/${property.id}`;
    try {
      await setDoc(doc(firestore, 'properties', property.id), property, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
}

// Delete property
export async function removeProperty(propertyId: string, firestore: Firestore | null): Promise<void> {
  const current = getLocalProperties().filter(p => p.id !== propertyId);
  saveLocalProperties(current);

  if (firestore) {
    const path = `properties/${propertyId}`;
    try {
      await deleteDoc(doc(firestore, 'properties', propertyId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
}

// Submit Inquiry
export async function submitInquiry(inquiry: Inquiry, firestore: Firestore | null): Promise<void> {
  const list = getLocalInquiries();
  list.unshift(inquiry);
  saveLocalInquiries(list);

  // Increment property inquiriesCount locally
  const props = getLocalProperties();
  const pIndex = props.findIndex(p => p.id === inquiry.propertyId);
  if (pIndex >= 0) {
    props[pIndex].inquiriesCount = (props[pIndex].inquiriesCount || 0) + 1;
    saveLocalProperties(props);
  }

  if (firestore) {
    const path = `inquiries/${inquiry.id}`;
    try {
      await setDoc(doc(firestore, 'inquiries', inquiry.id), inquiry);
      // Try to increment inquiry count on property in Firestore
      if (pIndex >= 0) {
        await updateDoc(doc(firestore, 'properties', inquiry.propertyId), {
          inquiriesCount: props[pIndex].inquiriesCount
        }).catch(() => {});
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
}

// Update Inquiry status
export async function updateInquiryStatus(
  inquiryId: string,
  newStatus: Inquiry['status'],
  firestore: Firestore | null
): Promise<void> {
  const list = getLocalInquiries();
  const item = list.find(i => i.id === inquiryId);
  if (item) {
    item.status = newStatus;
    saveLocalInquiries(list);
  }

  if (firestore) {
    const path = `inquiries/${inquiryId}`;
    try {
      await updateDoc(doc(firestore, 'inquiries', inquiryId), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
}

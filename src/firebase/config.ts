import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';

export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  firestoreDatabaseId?: string;
}

const STORAGE_KEY = 'estateguru_firebase_config';

export function getStoredFirebaseConfig(): FirebaseCustomConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.apiKey && parsed?.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored firebase config', e);
  }

  // Fallback to Vite environment variables if defined
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const envKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const envProject = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    if (envKey && envProject) {
      return {
        apiKey: envKey,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProject}.firebaseapp.com`,
        projectId: envProject,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProject}.appspot.com`,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
        firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || '(default)'
      };
    }
  }

  return null;
}

export function saveStoredFirebaseConfig(config: FirebaseCustomConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearStoredFirebaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
}

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let googleAuthProvider: GoogleAuthProvider | null = null;

export function initFirebase() {
  const config = getStoredFirebaseConfig();
  if (!config) {
    return { app: null, auth: null, db: null, googleProvider: null, isConfigured: false };
  }

  try {
    if (!getApps().length) {
      appInstance = initializeApp(config);
    } else {
      appInstance = getApp();
    }
    
    authInstance = getAuth(appInstance);
    // Support custom databaseId if specified
    firestoreInstance = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
      ? getFirestore(appInstance, config.firestoreDatabaseId)
      : getFirestore(appInstance);
      
    googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({ prompt: 'select_account' });

    return {
      app: appInstance,
      auth: authInstance,
      db: firestoreInstance,
      googleProvider: googleAuthProvider,
      isConfigured: true
    };
  } catch (err) {
    console.error('Error initializing Firebase SDK:', err);
    return { app: null, auth: null, db: null, googleProvider: null, isConfigured: false };
  }
}

export const { app, auth, db, googleProvider, isConfigured } = initFirebase();

export async function verifyFirestoreLiveConnection(database: Firestore): Promise<boolean> {
  try {
    await getDocFromServer(doc(database, 'system_health', 'ping'));
    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('the client is offline')) {
      console.warn('Firestore offline connection');
      return false;
    }
    // Any permission or response means server reached
    return true;
  }
}

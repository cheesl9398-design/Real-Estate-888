import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Property, Inquiry, FilterState, PropertyType, ListingType } from '../types/property';
import {
  fetchPropertiesFromFirestore,
  persistProperty,
  removeProperty,
  submitInquiry,
  updateInquiryStatus as updateInquiryStatusService,
  getLocalInquiries,
  saveLocalProperties
} from '../firebase/service';
import { db } from '../firebase/config';
import { INITIAL_PROPERTIES } from '../data/initialProperties';

export const DEFAULT_FILTERS: FilterState = {
  keyword: '',
  listingType: 'sale',
  propertyType: 'all',
  district: 'all',
  minPrice: 0,
  maxPrice: 30000000,
  bedrooms: 'all',
  bathrooms: 'all',
  minFloorArea: 0,
  tenure: 'all',
  verifiedOnly: false,
  hasVirtualTour: false,
  amenities: [],
  sortBy: 'featured'
};

interface PropertyContextType {
  properties: Property[];
  filteredProperties: Property[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  savedPropertyIds: string[];
  toggleSaveProperty: (id: string) => void;
  isSaved: (id: string) => boolean;
  addProperty: (prop: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'inquiriesCount'>) => Promise<Property>;
  updateProperty: (prop: Property) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  getPropertyById: (id: string) => Property | undefined;
  inquiries: Inquiry[];
  addInquiry: (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => Promise<void>;
  incrementPropertyView: (id: string) => void;
  resetToDemoData: () => void;
  loading: boolean;
  currentView: string;
  selectedPropertyId: string | null;
  navigateTo: (view: string, propId?: string) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const SAVED_PROPS_KEY = 'estateguru_saved_properties';

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Simple, URL-hash-aware routing for seamless navigation
  const [currentView, setCurrentView] = useState<string>('portal');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const props = await fetchPropertiesFromFirestore(db);
      setProperties(props);
      setInquiries(getLocalInquiries());

      try {
        const saved = localStorage.getItem(SAVED_PROPS_KEY);
        if (saved) {
          setSavedPropertyIds(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed reading saved properties', e);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Listen to hash changes for browser back/forward buttons
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || hash === '/') {
        setCurrentView('portal');
        setSelectedPropertyId(null);
      } else if (hash.startsWith('/property/')) {
        const id = hash.replace('/property/', '');
        setCurrentView('detail');
        setSelectedPropertyId(id);
      } else if (hash === '/dashboard') {
        setCurrentView('agent-dashboard');
      } else if (hash === '/new-listing') {
        setCurrentView('agent-new-listing');
      } else if (hash.startsWith('/edit-listing/')) {
        const id = hash.replace('/edit-listing/', '');
        setCurrentView('agent-edit-listing');
        setSelectedPropertyId(id);
      } else if (hash === '/saved') {
        setCurrentView('saved');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (view: string, propId?: string) => {
    setCurrentView(view);
    if (propId) {
      setSelectedPropertyId(propId);
    }
    
    // Update hash for natural navigation
    if (view === 'portal') {
      window.location.hash = '/';
    } else if (view === 'detail' && propId) {
      window.location.hash = `/property/${propId}`;
    } else if (view === 'agent-dashboard') {
      window.location.hash = '/dashboard';
    } else if (view === 'agent-new-listing') {
      window.location.hash = '/new-listing';
    } else if (view === 'agent-edit-listing' && propId) {
      window.location.hash = `/edit-listing/${propId}`;
    } else if (view === 'saved') {
      window.location.hash = '/saved';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSaveProperty = (id: string) => {
    setSavedPropertyIds(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem(SAVED_PROPS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isSaved = (id: string) => savedPropertyIds.includes(id);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const addProperty = async (
    propData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'inquiriesCount'>
  ): Promise<Property> => {
    const newProperty: Property = {
      ...propData,
      id: 'prop-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      viewsCount: 1,
      inquiriesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await persistProperty(newProperty, db);
    setProperties(prev => [newProperty, ...prev]);
    return newProperty;
  };

  const updateProperty = async (prop: Property): Promise<void> => {
    const updated: Property = {
      ...prop,
      updatedAt: new Date().toISOString()
    };
    await persistProperty(updated, db);
    setProperties(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const deleteProperty = async (id: string): Promise<void> => {
    await removeProperty(id, db);
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const getPropertyById = (id: string): Property | undefined => {
    return properties.find(p => p.id === id);
  };

  const incrementPropertyView = (id: string) => {
    setProperties(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, viewsCount: (p.viewsCount || 0) + 1 };
          persistProperty(updated, db).catch(() => {});
          return updated;
        }
        return p;
      })
    );
  };

  const addInquiry = async (
    inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>
  ): Promise<void> => {
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: 'inq-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      status: 'new',
      createdAt: new Date().toISOString()
    };
    await submitInquiry(newInquiry, db);
    setInquiries(prev => [newInquiry, ...prev]);

    // Also update property inquiry count locally
    setProperties(prev =>
      prev.map(p => {
        if (p.id === inquiryData.propertyId) {
          return { ...p, inquiriesCount: (p.inquiriesCount || 0) + 1 };
        }
        return p;
      })
    );
  };

  const updateInquiryStatus = async (id: string, status: Inquiry['status']): Promise<void> => {
    await updateInquiryStatusService(id, status, db);
    setInquiries(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));
  };

  const resetToDemoData = () => {
    saveLocalProperties(INITIAL_PROPERTIES);
    setProperties(INITIAL_PROPERTIES);
  };

  // Filtered properties computation
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // 1. Listing Type (sale or rent)
      if (filters.listingType && prop.listingType !== filters.listingType) {
        return false;
      }

      // 2. Keyword (searches in title, address, district, city, description)
      if (filters.keyword.trim()) {
        const kw = filters.keyword.toLowerCase();
        const matchesKeyword =
          prop.title.toLowerCase().includes(kw) ||
          prop.address.toLowerCase().includes(kw) ||
          prop.district.toLowerCase().includes(kw) ||
          prop.city.toLowerCase().includes(kw) ||
          (prop.description && prop.description.toLowerCase().includes(kw));
        if (!matchesKeyword) return false;
      }

      // 3. Property Type
      if (filters.propertyType !== 'all' && prop.propertyType !== filters.propertyType) {
        return false;
      }

      // 4. District
      if (filters.district !== 'all' && !prop.district.includes(filters.district)) {
        return false;
      }

      // 5. Price Range
      if (prop.price < filters.minPrice || prop.price > filters.maxPrice) {
        return false;
      }

      // 6. Bedrooms
      if (filters.bedrooms !== 'all') {
        if (filters.bedrooms === '5+') {
          if (prop.bedrooms < 5) return false;
        } else {
          const num = parseInt(filters.bedrooms, 10);
          if (prop.bedrooms !== num) return false;
        }
      }

      // 7. Bathrooms
      if (filters.bathrooms !== 'all') {
        const num = parseInt(filters.bathrooms, 10);
        if (prop.bathrooms < num) return false;
      }

      // 8. Min Floor Area
      if (filters.minFloorArea > 0 && prop.floorAreaSqft < filters.minFloorArea) {
        return false;
      }

      // 9. Verified Only
      if (filters.verifiedOnly && !prop.verified) {
        return false;
      }

      // 10. Virtual Tour
      if (filters.hasVirtualTour && !prop.virtualTourUrl) {
        return false;
      }

      // 11. Tenure
      if (filters.tenure !== 'all') {
        if (filters.tenure === 'Freehold' && prop.tenure !== 'Freehold') return false;
        if (filters.tenure === 'Leasehold' && !prop.tenure?.includes('Leasehold')) return false;
      }

      // 12. Amenities
      if (filters.amenities.length > 0) {
        const hasAll = filters.amenities.every(amenity =>
          prop.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
        );
        if (!hasAll) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sortBy === 'psf_asc') {
        const psfA = a.price / (a.floorAreaSqft || 1);
        const psfB = b.price / (b.floorAreaSqft || 1);
        return psfA - psfB;
      }
      if (filters.sortBy === 'psf_desc') {
        const psfA = a.price / (a.floorAreaSqft || 1);
        const psfB = b.price / (b.floorAreaSqft || 1);
        return psfB - psfA;
      }
      // Default: featured first, then newest
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [properties, filters]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        filters,
        setFilters,
        resetFilters,
        savedPropertyIds,
        toggleSaveProperty,
        isSaved,
        addProperty,
        updateProperty,
        deleteProperty,
        getPropertyById,
        inquiries,
        addInquiry,
        updateInquiryStatus,
        incrementPropertyView,
        resetToDemoData,
        loading,
        currentView,
        selectedPropertyId,
        navigateTo,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};

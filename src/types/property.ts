export type ListingType = 'sale' | 'rent';
export type PropertyType = 'condo' | 'landed' | 'apartment' | 'commercial';
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented';

export interface AgentInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  agency: string;
  licenseNumber: string;
  rating: number;
  reviewsCount: number;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  listingType: ListingType;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  floorAreaSqft: number;
  address: string;
  district: string;
  city: string;
  postalCode?: string;
  description: string;
  tenure?: 'Freehold' | '99-year Leasehold' | '999-year Leasehold';
  yearBuilt?: number;
  furnishing?: 'Fully Furnished' | 'Partially Furnished' | 'Unfurnished';
  amenities: string[];
  images: string[];
  agent: AgentInfo;
  status: PropertyStatus;
  featured?: boolean;
  verified?: boolean;
  virtualTourUrl?: string;
  viewsCount: number;
  inquiriesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  propertyImage?: string;
  agentId: string;
  agentName?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  message: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  inquiryType: 'schedule_viewing' | 'ask_question' | 'request_pricing';
  status: 'new' | 'contacted' | 'scheduled' | 'closed';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAgent?: boolean;
  agencyName?: string;
  licenseNumber?: string;
  phoneNumber?: string;
}

export interface FilterState {
  keyword: string;
  listingType: ListingType;
  propertyType: string; // 'all' or specific
  district: string; // 'all' or specific
  minPrice: number;
  maxPrice: number;
  bedrooms: string; // 'all', '1', '2', '3', '4', '5+'
  bathrooms: string;
  minFloorArea: number;
  tenure: string; // 'all', 'Freehold', 'Leasehold'
  verifiedOnly: boolean;
  hasVirtualTour: boolean;
  amenities: string[];
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'psf_asc' | 'psf_desc';
}

import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  Share2,
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  CheckCircle2,
  Building,
  BadgeCheck,
  Video,
  FileText,
  Printer,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { PropertyGallery } from '../components/PropertyGallery';
import { AgentInquiryForm } from '../components/AgentInquiryForm';
import { MortgageCalculator } from '../components/MortgageCalculator';
import { NeighborhoodTransit } from '../components/NeighborhoodTransit';
import { PropertyCard } from '../components/PropertyCard';
import { ShareModal } from '../components/ShareModal';
import { Property } from '../types/property';

interface PropertyDetailPageProps {
  propertyId: string;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ propertyId }) => {
  const { getPropertyById, properties, isSaved, toggleSaveProperty, navigateTo, incrementPropertyView } = useProperties();
  const [showShareModal, setShowShareModal] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const property = getPropertyById(propertyId);

  useEffect(() => {
    if (propertyId) {
      incrementPropertyView(propertyId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [propertyId]);

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Property Listing Not Found</h3>
          <p className="text-xs text-slate-500">
            This listing may have been sold, rented, or removed by the listing agent.
          </p>
          <button
            onClick={() => navigateTo('portal')}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition"
          >
            Back to Property Portal
          </button>
        </div>
      </div>
    );
  }

  const saved = isSaved(property.id);
  const psf = Math.round(property.price / (property.floorAreaSqft || 1));

  const formatPrice = (price: number, listingType: string) => {
    const formatted = new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(price).replace('SGD', 'S$');
    return listingType === 'rent' ? `${formatted} / mo` : formatted;
  };

  // Find 3 similar properties
  const similarProperties = properties
    .filter(p => p.id !== property.id && (p.propertyType === property.propertyType || p.listingType === property.listingType))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 overflow-hidden">
            <button
              onClick={() => navigateTo('portal')}
              className="flex items-center gap-1 font-semibold text-slate-700 hover:text-rose-600 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Portal</span>
            </button>
            <span>/</span>
            <span className="capitalize">{property.propertyType}</span>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-xs">
              {property.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => toggleSaveProperty(property.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                saved
                  ? 'bg-rose-600 text-white'
                  : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-white' : ''}`} />
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Title and Price Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-md bg-slate-900 text-white">
                For {property.listingType === 'sale' ? 'Sale' : 'Rent'}
              </span>
              <span className="px-2.5 py-1 text-[11px] font-semibold capitalize rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                {property.propertyType}
              </span>
              {property.verified && (
                <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified Title
                </span>
              )}
              {property.virtualTourUrl && (
                <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" />
                  Matterport 3D Tour
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{property.address} • {property.district}</span>
            </div>
          </div>

          <div className="lg:text-right shrink-0 bg-white lg:bg-transparent p-4 lg:p-0 rounded-2xl border lg:border-none border-slate-200">
            <span className="text-xs text-slate-400 font-medium block">Guide Price</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-rose-600">
              {formatPrice(property.price, property.listingType)}
            </div>
            {property.listingType === 'sale' && (
              <span className="text-xs sm:text-sm font-semibold text-slate-500 block mt-0.5">
                S${psf.toLocaleString()} psf • {property.floorAreaSqft.toLocaleString()} sqft
              </span>
            )}
          </div>
        </div>

        {/* Gallery */}
        <PropertyGallery images={property.images} title={property.title} />

        {/* Main Content & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Details, Amenities, Map, Calculator */}
          <div className="lg:col-span-2 space-y-8">
            {/* Highlights Bar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">
                Property Highlights
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Bedrooms</span>
                    <span className="text-sm font-bold text-slate-900">
                      {property.bedrooms > 0 ? `${property.bedrooms} Beds` : 'Studio'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Bathrooms</span>
                    <span className="text-sm font-bold text-slate-900">
                      {property.bathrooms} Baths
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Floor Area</span>
                    <span className="text-sm font-bold text-slate-900">
                      {property.floorAreaSqft.toLocaleString()} sqft
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Tenure</span>
                    <span className="text-sm font-bold text-slate-900 truncate">
                      {property.tenure || 'Freehold'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block">Year Built:</span>
                  <span className="font-semibold text-slate-800">{property.yearBuilt || 2020}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Furnishing:</span>
                  <span className="font-semibold text-slate-800">{property.furnishing || 'Partially Furnished'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Postal Code:</span>
                  <span className="font-semibold text-slate-800">{property.postalCode || 'Singapore'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Status:</span>
                  <span className="font-semibold capitalize text-emerald-600">{property.status}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900">About this Property</h3>
              <p className={`text-xs sm:text-sm text-slate-600 leading-relaxed ${!descriptionExpanded ? 'line-clamp-4' : ''}`}>
                {property.description}
              </p>
              {property.description.length > 250 && (
                <button
                  type="button"
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                >
                  {descriptionExpanded ? 'Read Less' : 'Read Full Description'}
                </button>
              )}
            </div>

            {/* Amenities & Facilities Checklist */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900">Facilities & Project Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map(amenity => (
                  <div
                    key={amenity}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs font-semibold text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Neighborhood Transit & Map */}
            <NeighborhoodTransit
              address={property.address}
              district={property.district}
              propertyTitle={property.title}
            />

            {/* Mortgage Calculator */}
            <MortgageCalculator
              propertyPrice={property.price}
              listingType={property.listingType}
            />
          </div>

          {/* Right Col: Agent Contact Form Sidebar */}
          <div className="lg:col-span-1">
            <AgentInquiryForm property={property} />
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Similar Properties in {property.district.split('-')[0]}
                </h3>
                <p className="text-xs text-slate-500">
                  You might also be interested in these handpicked homes
                </p>
              </div>
              <button
                onClick={() => navigateTo('portal')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map(sim => (
                <PropertyCard key={sim.id} property={sim} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        property={showShareModal ? property : null}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};

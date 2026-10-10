import React, { useState } from 'react';
import {
  Heart,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  BadgeCheck,
  Video,
  Share2,
  Calendar,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Property } from '../types/property';
import { useProperties } from '../context/PropertyContext';

interface PropertyCardProps {
  property: Property;
  onShare?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onShare }) => {
  const { navigateTo, isSaved, toggleSaveProperty } = useProperties();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const saved = isSaved(property.id);

  const formatPrice = (price: number, listingType: string) => {
    const formatted = new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      maximumFractionDigits: 0,
    }).format(price).replace('SGD', 'S$');

    return listingType === 'rent' ? `${formatted} / mo` : formatted;
  };

  const psf = Math.round(property.price / (property.floorAreaSqft || 1));

  const handleCardClick = () => {
    navigateTo('detail', property.id);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveProperty(property.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(property);
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/#property/${property.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={property.images[currentImgIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          {property.featured && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-rose-600 text-white shadow-sm">
              Featured
            </span>
          )}
          {property.verified && (
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-600/90 text-white backdrop-blur-xs flex items-center gap-1 shadow-sm">
              <BadgeCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
          {property.virtualTourUrl && (
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-slate-900/80 text-white backdrop-blur-xs flex items-center gap-1 shadow-sm">
              <Video className="w-3.5 h-3.5 text-rose-400" />
              3D Tour
            </span>
          )}
        </div>

        {/* Top Right Save & Share Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={handleShareClick}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md backdrop-blur-xs transition"
            title="Share property"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleSaveClick}
            className={`p-2 rounded-full shadow-md backdrop-blur-xs transition ${
              saved
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-white/80 hover:bg-white text-slate-700'
            }`}
            title={saved ? 'Remove from saved' : 'Save property'}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Image pagination dots if multiple images */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10">
            {property.images.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImgIndex(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  currentImgIndex === idx
                    ? 'w-4 bg-white'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & PSF row */}
          <div className="flex items-baseline justify-between mb-1.5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatPrice(property.price, property.listingType)}
            </h3>
            {property.listingType === 'sale' && (
              <span className="text-xs font-semibold text-slate-500">
                S${psf.toLocaleString()} psf
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-rose-600 transition mb-2">
            {property.title}
          </h4>

          {/* Address */}
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{property.address}</span>
          </div>

          {/* Specs: Beds, Baths, Sqft */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-700 mb-4">
            <div className="flex items-center gap-1.5 justify-center">
              <Bed className="w-4 h-4 text-slate-500" />
              <span>{property.bedrooms > 0 ? `${property.bedrooms} Beds` : 'Studio'}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center border-x border-slate-200">
              <Bath className="w-4 h-4 text-slate-500" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center">
              <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{property.floorAreaSqft.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>

        {/* Card Footer: Agent Preview & Tenure */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={property.agent.photoUrl}
              alt={property.agent.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <div className="leading-tight">
              <span className="text-xs font-semibold text-slate-800 block truncate max-w-[130px]">
                {property.agent.name}
              </span>
              <span className="text-[10px] text-slate-400 block truncate max-w-[130px]">
                {property.agent.agency.split(' ')[0]}
              </span>
            </div>
          </div>

          {property.tenure && (
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {property.tenure.split(' ')[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

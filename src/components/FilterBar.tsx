import React, { useState } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Check,
  X,
  BadgeCheck,
  Video,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { ALL_AMENITIES, DISTRICTS } from '../data/initialProperties';

export const FilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, filteredProperties, properties } = useProperties();
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);

  const activeFiltersCount = [
    filters.propertyType !== 'all',
    filters.district !== 'all',
    filters.bedrooms !== 'all',
    filters.bathrooms !== 'all',
    filters.tenure !== 'all',
    filters.verifiedOnly,
    filters.hasVirtualTour,
    filters.amenities.length > 0,
    filters.minFloorArea > 0,
    filters.keyword.trim().length > 0
  ].filter(Boolean).length;

  const handlePropertyTypeQuickClick = (type: string) => {
    setFilters(prev => ({ ...prev, propertyType: type }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  return (
    <div className="bg-white border-y border-slate-200 py-3.5 mb-6 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Quick Property Type Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { label: 'All Listings', value: 'all' },
              { label: 'Condominiums', value: 'condo' },
              { label: 'Landed Houses', value: 'landed' },
              { label: 'Apartments / HDB', value: 'apartment' },
              { label: 'Commercial', value: 'commercial' },
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => handlePropertyTypeQuickClick(tab.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
                  filters.propertyType === tab.value
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right: Advanced Filter Drawer & Sort options */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Filter Drawer Button */}
            <button
              onClick={() => setShowAdvancedModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                activeFiltersCount > 0
                  ? 'border-rose-600 text-rose-600 bg-rose-50'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Reset Button if active filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 transition cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.sortBy}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    sortBy: e.target.value as any,
                  }))
                }
                className="bg-transparent border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Listed</option>
                <option value="psf_asc">Price/Sqft: Low to High</option>
                <option value="psf_desc">Price/Sqft: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results summary bar */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{filteredProperties.length}</strong> of{' '}
            {properties.length} properties
            {filters.listingType === 'sale' ? ' for Sale' : ' for Rent'}
          </span>
          {filters.keyword && (
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">
              Keyword: &quot;{filters.keyword}&quot;
            </span>
          )}
        </div>
      </div>

      {/* Advanced Filter Modal */}
      {showAdvancedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-base">Advanced Property Filters</h3>
              </div>
              <button
                onClick={() => setShowAdvancedModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Tenure */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tenure
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['all', 'Freehold', 'Leasehold'].map(ten => (
                    <button
                      key={ten}
                      type="button"
                      onClick={() => setFilters(prev => ({ ...prev, tenure: ten }))}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border transition ${
                        filters.tenure === ten
                          ? 'bg-rose-50 border-rose-500 text-rose-700'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {ten === 'all' ? 'Any Tenure' : ten}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified & Virtual Tour Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    filters.verifiedOnly
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BadgeCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Verified Listings Only
                      </span>
                      <span className="text-[11px] text-slate-500">Ownership & title vetted</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={e =>
                      setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))
                    }
                    className="w-4 h-4 accent-emerald-600"
                  />
                </label>

                <label
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    filters.hasVirtualTour
                      ? 'bg-rose-50 border-rose-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="w-5 h-5 text-rose-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        3D Virtual Tour Available
                      </span>
                      <span className="text-[11px] text-slate-500">Matterport / 360 walk</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.hasVirtualTour}
                    onChange={e =>
                      setFilters(prev => ({ ...prev, hasVirtualTour: e.target.checked }))
                    }
                    className="w-4 h-4 accent-rose-600"
                  />
                </label>
              </div>

              {/* Amenities Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Facilities & Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_AMENITIES.map(amenity => {
                    const selected = filters.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg text-left border flex items-center justify-between transition ${
                          selected
                            ? 'bg-rose-50 border-rose-400 text-rose-700 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{amenity}</span>
                        {selected && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setShowAdvancedModal(false)}
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Apply Filters ({filteredProperties.length} Matches)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

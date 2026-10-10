import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Home,
  DollarSign,
  Bed,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { DISTRICTS } from '../data/initialProperties';
import { ListingType } from '../types/property';

export const HeroSearch: React.FC = () => {
  const { filters, setFilters } = useProperties();

  const [activeTab, setActiveTab] = useState<ListingType>(filters.listingType || 'sale');
  const [keyword, setKeyword] = useState(filters.keyword || '');
  const [propertyType, setPropertyType] = useState(filters.propertyType || 'all');
  const [district, setDistrict] = useState(filters.district || 'all');
  const [bedrooms, setBedrooms] = useState(filters.bedrooms || 'all');
  const [priceBracket, setPriceBracket] = useState<string>('all');

  const handleTabChange = (type: ListingType) => {
    setActiveTab(type);
    setFilters(prev => ({
      ...prev,
      listingType: type,
      // Adjust default max price for rent vs sale
      maxPrice: type === 'rent' ? 50000 : 30000000,
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let minP = 0;
    let maxP = activeTab === 'rent' ? 50000 : 30000000;

    if (activeTab === 'sale') {
      if (priceBracket === 'under_1m') { minP = 0; maxP = 1000000; }
      else if (priceBracket === '1m_2m') { minP = 1000000; maxP = 2000000; }
      else if (priceBracket === '2m_5m') { minP = 2000000; maxP = 5000000; }
      else if (priceBracket === '5m_plus') { minP = 5000000; maxP = 50000000; }
    } else {
      if (priceBracket === 'under_3k') { minP = 0; maxP = 3000; }
      else if (priceBracket === '3k_6k') { minP = 3000; maxP = 6000; }
      else if (priceBracket === '6k_10k') { minP = 6000; maxP = 10000; }
      else if (priceBracket === '10k_plus') { minP = 10000; maxP = 80000; }
    }

    setFilters(prev => ({
      ...prev,
      listingType: activeTab,
      keyword,
      propertyType,
      district,
      bedrooms,
      minPrice: minP,
      maxPrice: maxP,
    }));

    // Scroll to listing grid
    const target = document.getElementById('listings-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const setPresetDistrict = (dist: string) => {
    setDistrict(dist);
    setFilters(prev => ({ ...prev, district: dist }));
    const target = document.getElementById('listings-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24">
      {/* Background architectural image with overlay */}
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header content */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Verified Singapore Real Estate</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Find Your Dream Home with <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">Total Confidence</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Explore 12,000+ verified luxury condos, freehold landed bungalows, and prime downtown offices with direct agent connections.
          </p>
        </div>

        {/* Search Widget Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-slate-900 border border-slate-100">
          {/* Buy vs Rent Tab Switcher */}
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <button
              type="button"
              onClick={() => handleTabChange('sale')}
              className={`px-5 py-2 text-sm font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'sale'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Buy Property
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('rent')}
              className={`px-5 py-2 text-sm font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'rent'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Rent Property
            </button>
          </div>

          {/* Search Form Fields */}
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            {/* Main Keyword Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-rose-500" />
              </div>
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Search by Condo name, MRT station, District, or Street (e.g. Marina One, Nassim)..."
                className="w-full pl-11 pr-4 py-3 text-sm sm:text-base border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition bg-slate-50/50 hover:bg-white"
              />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Property Type */}
              <div className="relative">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Property Type
                </label>
                <div className="relative">
                  <select
                    value={propertyType}
                    onChange={e => setPropertyType(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none pr-8 cursor-pointer"
                  >
                    <option value="all">All Types (Any)</option>
                    <option value="condo">Condominium</option>
                    <option value="landed">Landed House / Villa</option>
                    <option value="apartment">HDB & Apartment</option>
                    <option value="commercial">Commercial / Office</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* District */}
              <div className="relative">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  District / Location
                </label>
                <div className="relative">
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none pr-8 cursor-pointer"
                  >
                    <option value="all">All Districts</option>
                    {DISTRICTS.filter(d => d !== 'All Districts').map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Price Range */}
              <div className="relative">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Price Range
                </label>
                <div className="relative">
                  <select
                    value={priceBracket}
                    onChange={e => setPriceBracket(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none pr-8 cursor-pointer"
                  >
                    <option value="all">Any Price</option>
                    {activeTab === 'sale' ? (
                      <>
                        <option value="under_1m">Under S$1,000,000</option>
                        <option value="1m_2m">S$1M - S$2M</option>
                        <option value="2m_5m">S$2M - S$5M</option>
                        <option value="5m_plus">S$5,000,000+</option>
                      </>
                    ) : (
                      <>
                        <option value="under_3k">Under S$3,000/mo</option>
                        <option value="3k_6k">S$3,000 - S$6,000/mo</option>
                        <option value="6k_10k">S$6,000 - S$10,000/mo</option>
                        <option value="10k_plus">S$10,000+/mo</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Bedrooms */}
              <div className="relative">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Bedrooms
                </label>
                <div className="relative">
                  <select
                    value={bedrooms}
                    onChange={e => setBedrooms(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none pr-8 cursor-pointer"
                  >
                    <option value="all">Any Bedrooms</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5+">5+ Bedrooms</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <span className="font-semibold text-slate-700">Popular:</span>
                <button
                  type="button"
                  onClick={() => setPresetDistrict('D01 - Marina Bay / Downtown')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 transition"
                >
                  Marina Bay
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDistrict('D10 - Tanglin / Nassim / Holland')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 transition"
                >
                  District 10 Nassim
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDistrict('D15 - East Coast / Marine Parade')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 transition"
                >
                  East Coast
                </button>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Properties</span>
              </button>
            </div>
          </form>
        </div>

        {/* Feature stats counters */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <span className="text-xl sm:text-2xl font-extrabold text-white">12,450+</span>
            <p className="text-xs text-slate-400 mt-0.5">Active Listings</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400">100%</span>
            <p className="text-xs text-slate-400 mt-0.5">Verified CEA Agents</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-400">S$0</span>
            <p className="text-xs text-slate-400 mt-0.5">Direct Buyer Commission</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <span className="text-xl sm:text-2xl font-extrabold text-rose-400">360°</span>
            <p className="text-xs text-slate-400 mt-0.5">Virtual 3D Home Tours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

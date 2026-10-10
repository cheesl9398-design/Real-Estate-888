import React, { useState } from 'react';
import { HeroSearch } from '../components/HeroSearch';
import { FilterBar } from '../components/FilterBar';
import { PropertyCard } from '../components/PropertyCard';
import { ShareModal } from '../components/ShareModal';
import { useProperties } from '../context/PropertyContext';
import { Property } from '../types/property';
import {
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building,
  KeyRound,
  Compass,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { filteredProperties, filters, resetFilters, setFilters, navigateTo } = useProperties();
  const [sharingProperty, setSharingProperty] = useState<Property | null>(null);

  const curatedDistricts = [
    {
      name: 'Marina Bay & Downtown',
      code: 'D01',
      desc: 'Waterfront luxury towers & world financial hub',
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
      filterDistrict: 'D01 - Marina Bay / Downtown',
    },
    {
      name: 'Tanglin & Nassim Hill',
      code: 'D10',
      desc: 'Prestigious Good Class Bungalows & embassies',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
      filterDistrict: 'D10 - Tanglin / Nassim / Holland',
    },
    {
      name: 'East Coast & Marine Parade',
      code: 'D15',
      desc: 'Coastal seaside living, heritage food & top schools',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
      filterDistrict: 'D15 - East Coast / Marine Parade',
    },
    {
      name: 'Tanjong Pagar & Duxton',
      code: 'D02',
      desc: 'Historic shophouses, chic dining & modern lofts',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      filterDistrict: 'D02 - Chinatown / Tanjong Pagar',
    },
  ];

  const handleDistrictClick = (districtFilter: string) => {
    setFilters(prev => ({ ...prev, district: districtFilter }));
    const el = document.getElementById('listings-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <HeroSearch />

      {/* Main Listing Section */}
      <section id="listings-section" className="scroll-mt-16">
        <FilterBar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Real Estate Marketplace</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {filters.district !== 'all'
                  ? `Properties in ${filters.district}`
                  : filters.propertyType !== 'all'
                  ? `${filters.propertyType.toUpperCase()} Properties`
                  : 'Premier Property Listings'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Updated in real-time via Firestore Cloud Database
            </p>
          </div>

          {/* Listings Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onShare={setSharingProperty}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm my-8">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No matching properties found</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                We couldn&apos;t find any properties matching your current filter criteria. Try adjusting your price range, location, or reset filters to see all available listings.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 mx-auto transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Explore Singapore Prime Districts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-rose-600 text-xs font-bold uppercase tracking-wider">
              Neighborhood Guides
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              Explore Coveted Prime Districts
            </h3>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            From iconic high-rise skyline living to quiet landed enclaves, find the neighborhood that matches your lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {curatedDistricts.map(item => (
            <div
              key={item.code}
              onClick={() => handleDistrictClick(item.filterDistrict)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[11px] font-bold">
                {item.code}
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="font-extrabold text-base group-hover:text-rose-300 transition flex items-center justify-between">
                  <span>{item.name}</span>
                  <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Propositions / Why EstateGuru */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Buyers & Tenants Trust EstateGuru
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Transforming property discovery with transparency, verified credentials, and real-time agent workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start">
              <div className="p-3 rounded-xl bg-rose-100 text-rose-600 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-1.5">100% CEA Licensed Agents</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every listing agent is vetted with genuine council registration numbers. Connect safely with top agency producers from PropNex, ERA, and Huttons.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 mb-4">
                <Building className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-1.5">Direct Real-Time Database</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Powered by Google Firebase Firestore. New listings, price modifications, and viewing inquiries synchronize instantly across devices.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600 mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-1.5">Zero Buyer Brokerage Fee</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct access to property viewing appointments, virtual walkthroughs, and official developer floor plans without intermediary fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Share Modal */}
      <ShareModal
        property={sharingProperty}
        onClose={() => setSharingProperty(null)}
      />
    </div>
  );
};

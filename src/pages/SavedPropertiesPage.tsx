import React from 'react';
import { Heart, ArrowLeft, Building2 } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from '../components/PropertyCard';

export const SavedPropertiesPage: React.FC = () => {
  const { properties, savedPropertyIds, navigateTo } = useProperties();

  const savedListings = properties.filter(p => savedPropertyIds.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('portal')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-600 fill-rose-600" />
                Saved Properties
              </h1>
              <p className="text-xs text-slate-500">
                {savedListings.length} properties shortlisted for review
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('portal')}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 underline"
          >
            Explore More Properties
          </button>
        </div>

        {savedListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {savedListings.map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm my-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Saved Properties Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Click the heart icon on any property card to save your favorite listings for easy comparison and viewing.
            </p>
            <button
              onClick={() => navigateTo('portal')}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition"
            >
              Browse Property Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

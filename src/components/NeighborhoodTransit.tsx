import React, { useState } from 'react';
import {
  MapPin,
  Train,
  GraduationCap,
  ShoppingBag,
  Trees,
  Navigation,
  Compass,
  Footprints,
  ExternalLink
} from 'lucide-react';

interface NeighborhoodTransitProps {
  address: string;
  district: string;
  propertyTitle: string;
}

export const NeighborhoodTransit: React.FC<NeighborhoodTransitProps> = ({
  address,
  district,
  propertyTitle,
}) => {
  const [activeCategory, setActiveCategory] = useState<'transit' | 'schools' | 'amenities' | 'parks'>('transit');

  const places = {
    transit: [
      { name: 'Nearest MRT Interchange', distance: '180m', walkTime: '2 mins walk', line: 'Circle / Downtown Line' },
      { name: 'Sheltered Bus Terminal', distance: '90m', walkTime: '1 min walk', line: 'Bus 10, 70, 100, 196' },
      { name: 'Central Expressway (CTE / MCE)', distance: '800m', walkTime: '3 mins drive', line: 'Direct highway slip-road' },
    ],
    schools: [
      { name: 'Cantonment Primary School', distance: '650m', walkTime: '8 mins walk', line: 'Within 1km Priority Zone' },
      { name: 'Singapore Chinese Girls School', distance: '2.4km', walkTime: '6 mins drive', line: 'Premier Institution' },
      { name: 'Anglo-Chinese School (Junior)', distance: '3.1km', walkTime: '8 mins drive', line: 'Established Heritage' },
    ],
    amenities: [
      { name: 'Cold Storage / FairPrice Finest', distance: '120m', walkTime: '2 mins walk', line: 'Gourmet Groceries' },
      { name: 'Marina Bay Sands / Shoppes', distance: '950m', walkTime: '10 mins walk', line: 'Luxury Shopping & Dining' },
      { name: 'Raffles Place CBD', distance: '800m', walkTime: '9 mins walk', line: 'Financial Hub' },
    ],
    parks: [
      { name: 'Gardens by the Bay', distance: '900m', walkTime: '11 mins walk', line: 'Waterfront Greenery' },
      { name: 'Marina Coastal Park Connector', distance: '250m', walkTime: '3 mins walk', line: 'Jogging & Cycling' },
      { name: 'Fort Canning Park', distance: '1.8km', walkTime: '5 mins drive', line: 'Historical Nature Reserve' },
    ],
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-600" /> Location & Neighborhood Transit
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{address} ({district})</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
            <Footprints className="w-3.5 h-3.5" /> 98/100 Walk Score
          </span>
        </div>
      </div>

      {/* Styled Interactive Map Placeholder Canvas */}
      <div className="relative rounded-xl overflow-hidden aspect-[16/8] bg-slate-900 border border-slate-200 group">
        {/* Map Mock Background */}
        <div className="absolute inset-0 bg-slate-950 opacity-90">
          <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            {/* Roads */}
            <path d="M 0,140 Q 300,100 800,200" stroke="#f43f5e" strokeWidth="3" fill="none" />
            <path d="M 120,0 L 280,400" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
            <path d="M 400,0 Q 420,200 650,400" stroke="#fbbf24" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Center Property Pin */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center">
            <div className="animate-bounce flex flex-col items-center">
              <div className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-xl border border-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="max-w-[140px] truncate">{propertyTitle}</span>
              </div>
              <div className="w-3 h-3 bg-rose-600 rotate-45 -mt-1.5 border-r border-b border-white" />
            </div>
            <div className="w-8 h-2 rounded-full bg-black/40 blur-xs" />
          </div>
        </div>

        {/* Map Controls Overlay */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-rose-600 animate-spin" />
          <span>Interactive Location View</span>
        </div>

        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] text-slate-200 flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-rose-400" />
          <span>{address}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveCategory('transit')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
            activeCategory === 'transit'
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Train className="w-3.5 h-3.5" /> Transit & MRT
        </button>
        <button
          onClick={() => setActiveCategory('schools')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
            activeCategory === 'schools'
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" /> Nearby Schools
        </button>
        <button
          onClick={() => setActiveCategory('amenities')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
            activeCategory === 'amenities'
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Malls & Groceries
        </button>
        <button
          onClick={() => setActiveCategory('parks')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
            activeCategory === 'parks'
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Trees className="w-3.5 h-3.5" /> Parks & Recreation
        </button>
      </div>

      {/* Selected Category Details List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {places[activeCategory].map((place, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-900 block truncate">{place.name}</span>
            <div className="flex items-center justify-between text-xs text-rose-600 font-semibold mt-1">
              <span>{place.distance}</span>
              <span className="text-slate-500 font-normal">{place.walkTime}</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block truncate">{place.line}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

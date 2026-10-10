import React from 'react';
import { Building2, Shield, Award, Heart, ExternalLink, Github } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

export const Footer: React.FC = () => {
  const { setFilters, navigateTo } = useProperties();

  const handleCategoryClick = (propertyType: string, listingType: 'sale' | 'rent' = 'sale') => {
    setFilters(prev => ({ ...prev, propertyType, listingType }));
    navigateTo('portal');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand and Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Estate<span className="text-rose-500">Guru</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Asia leading property marketplace designed with modern architecture. Providing transparent pricing, verified listings, 3D tours, and real-time agent workflow powered by Firebase & Google Authentication.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>100% CEA Registered Agents</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Verified Direct Listings</span>
              </div>
            </div>
          </div>

          {/* Buy Properties */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Buy Properties
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleCategoryClick('condo', 'sale')}
                  className="hover:text-rose-400 transition"
                >
                  Condominiums for Sale
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('landed', 'sale')}
                  className="hover:text-rose-400 transition"
                >
                  Landed Houses & Bungalows
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('apartment', 'sale')}
                  className="hover:text-rose-400 transition"
                >
                  HDB & Executive Apartments
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('commercial', 'sale')}
                  className="hover:text-rose-400 transition"
                >
                  Commercial & Shophouses
                </button>
              </li>
            </ul>
          </div>

          {/* Rent Properties */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Rent Properties
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleCategoryClick('condo', 'rent')}
                  className="hover:text-rose-400 transition"
                >
                  Condo Rentals
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('apartment', 'rent')}
                  className="hover:text-rose-400 transition"
                >
                  Room & Whole Unit Rentals
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('commercial', 'rent')}
                  className="hover:text-rose-400 transition"
                >
                  Grade A Office Spaces
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('landed', 'rent')}
                  className="hover:text-rose-400 transition"
                >
                  Landed Properties for Rent
                </button>
              </li>
            </ul>
          </div>

          {/* Agent Resources & Deployment */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Agent & Tech Stack
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('agent-new-listing')}
                  className="hover:text-rose-400 transition text-rose-400 font-semibold"
                >
                  + Post New Listing
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('agent-dashboard')}
                  className="hover:text-rose-400 transition"
                >
                  Agent Portal & Analytics
                </button>
              </li>
              <li className="pt-2">
                <span className="text-[11px] text-slate-500 block mb-1">Deployment Ready:</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono inline-block">
                  Next.js / Vite + Firebase
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 EstateGuru Platform. Inspired by PropertyGuru. Built for high performance.</p>
          <div className="flex items-center gap-6 text-slate-500">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Security Rules Validated</span>
            <span className="text-rose-500 flex items-center gap-1 font-medium">
              Made with <Heart className="w-3.5 h-3.5 fill-rose-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

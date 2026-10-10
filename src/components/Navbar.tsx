import React, { useState } from 'react';
import {
  Building2,
  Heart,
  PlusCircle,
  Database,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Plus,
  User,
  Menu,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { FirebaseSettingsModal } from './FirebaseSettingsModal';

export const Navbar: React.FC = () => {
  const { user, signInWithGoogle, signInAsDemoAgent, signOut, isFirebaseActive } = useAuth();
  const { savedPropertyIds, currentView, navigateTo, setFilters, resetFilters } = useProperties();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleNavClick = (listingType?: 'sale' | 'rent', propType?: string) => {
    resetFilters();
    if (listingType) {
      setFilters(prev => ({ ...prev, listingType }));
    }
    if (propType) {
      setFilters(prev => ({ ...prev, propertyType: propType }));
    }
    navigateTo('portal');
    setShowMobileMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        {/* Top announcement bar */}
        <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-rose-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Singapore & Southeast Asia Premier Property Platform
            </span>
            <span className="text-slate-500">•</span>
            <span>Over 12,000+ Verified Homes & Commercial Listings</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFirebaseModal(true)}
              className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isFirebaseActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-[11px] font-medium">
                {isFirebaseActive ? 'Firebase Cloud Connected' : 'Local Reactive Sync'}
              </span>
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => handleNavClick()}
                className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-extrabold tracking-tight text-slate-900">
                      Estate<span className="text-rose-600">Guru</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100">
                      PRO
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium hidden sm:block -mt-0.5">
                    Find Your Dream Home
                  </p>
                </div>
              </button>

              {/* Portal categories */}
              <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
                <button
                  onClick={() => handleNavClick('sale', 'all')}
                  className={`px-3 py-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer ${
                    currentView === 'portal' ? 'text-slate-900 font-semibold' : ''
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => handleNavClick('rent', 'all')}
                  className="px-3 py-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  Rent
                </button>
                <button
                  onClick={() => handleNavClick('sale', 'condo')}
                  className="px-3 py-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  Condos
                </button>
                <button
                  onClick={() => handleNavClick('sale', 'landed')}
                  className="px-3 py-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  Landed
                </button>
                <button
                  onClick={() => handleNavClick('rent', 'commercial')}
                  className="px-3 py-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  Commercial
                </button>
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Saved Properties */}
              <button
                onClick={() => navigateTo('saved')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
                  currentView === 'saved'
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Saved Properties"
              >
                <Heart className={`w-4 h-4 ${savedPropertyIds.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>Saved</span>
                {savedPropertyIds.length > 0 && (
                  <span className="w-5 h-5 text-xs rounded-full bg-rose-600 text-white flex items-center justify-center font-bold">
                    {savedPropertyIds.length}
                  </span>
                )}
              </button>

              {/* Post Listing CTA (Direct Agent Upload) */}
              <button
                onClick={() => navigateTo('agent-new-listing')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200/80 shadow-xs transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-rose-600" />
                <span>Post Listing</span>
              </button>

              {/* Cloud/Firebase Status Trigger */}
              <button
                onClick={() => setShowFirebaseModal(true)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                title="Firebase & Cloud Sync Settings"
              >
                <Database className="w-4 h-4" />
              </button>

              {/* User / Agent Auth */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <img
                      src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={user.displayName || 'Agent'}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div className="text-left text-xs leading-tight">
                      <span className="font-semibold text-slate-900 block max-w-[120px] truncate">
                        {user.displayName || 'Agent'}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium">Licensed Agent</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fadeIn"
                      onMouseLeave={() => setShowUserMenu(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {user.displayName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigateTo('agent-dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Agent Dashboard
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigateTo('agent-new-listing');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-slate-400" />
                        Create New Listing
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <div className="px-3 py-1">
                        <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                          Switch Agent Persona
                        </span>
                        <div className="grid grid-cols-3 gap-1 mt-1">
                          <button
                            onClick={() => {
                              signInAsDemoAgent('geraldine');
                              setShowUserMenu(false);
                            }}
                            className="px-1.5 py-1 text-[11px] rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium truncate"
                            title="Geraldine Tan (PropNex)"
                          >
                            Geraldine
                          </button>
                          <button
                            onClick={() => {
                              signInAsDemoAgent('marcus');
                              setShowUserMenu(false);
                            }}
                            className="px-1.5 py-1 text-[11px] rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium truncate"
                            title="Marcus Chen (ERA)"
                          >
                            Marcus
                          </button>
                          <button
                            onClick={() => {
                              signInAsDemoAgent('sarah');
                              setShowUserMenu(false);
                            }}
                            className="px-1.5 py-1 text-[11px] rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium truncate"
                            title="Sarah Lim (Huttons)"
                          >
                            Sarah
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Google Login */}
                  <button
                    onClick={() => signInWithGoogle()}
                    className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google Sign In</span>
                  </button>

                  {/* Agent Quick Demo Switcher */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDemoMenu(!showDemoMenu)}
                      className="px-2.5 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Demo Agent</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {showDemoMenu && (
                      <div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50"
                        onMouseLeave={() => setShowDemoMenu(false)}
                      >
                        <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                          Sign In As Agent
                        </div>
                        <button
                          onClick={() => {
                            signInAsDemoAgent('geraldine');
                            setShowDemoMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-600 block"
                        >
                          Geraldine Tan (PropNex)
                        </button>
                        <button
                          onClick={() => {
                            signInAsDemoAgent('marcus');
                            setShowDemoMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-600 block"
                        >
                          Marcus Chen (ERA)
                        </button>
                        <button
                          onClick={() => {
                            signInAsDemoAgent('sarah');
                            setShowDemoMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-600 block"
                        >
                          Sarah Lim (Huttons)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => navigateTo('saved')}
                className="p-2 text-slate-600 hover:text-rose-600 relative"
              >
                <Heart className={`w-5 h-5 ${savedPropertyIds.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                {savedPropertyIds.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 text-[10px] rounded-full bg-rose-600 text-white flex items-center justify-center font-bold">
                    {savedPropertyIds.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <button
                onClick={() => handleNavClick('sale', 'all')}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-800 text-left"
              >
                Buy Properties
              </button>
              <button
                onClick={() => handleNavClick('rent', 'all')}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-800 text-left"
              >
                Rent Properties
              </button>
              <button
                onClick={() => handleNavClick('sale', 'condo')}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-800 text-left"
              >
                Condominiums
              </button>
              <button
                onClick={() => handleNavClick('sale', 'landed')}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-800 text-left"
              >
                Landed Houses
              </button>
            </div>

            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  navigateTo('agent-new-listing');
                  setShowMobileMenu(false);
                }}
                className="w-full py-2.5 px-4 bg-rose-600 text-white font-semibold rounded-xl text-center text-sm shadow-md"
              >
                Post New Listing
              </button>
              <button
                onClick={() => {
                  navigateTo('agent-dashboard');
                  setShowMobileMenu(false);
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl text-center text-sm"
              >
                Agent Dashboard & My Listings
              </button>
              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setShowMobileMenu(false);
                  }}
                  className="w-full py-2 text-red-600 text-xs font-semibold text-center"
                >
                  Sign Out ({user.displayName})
                </button>
              ) : (
                <button
                  onClick={() => {
                    signInWithGoogle();
                    setShowMobileMenu(false);
                  }}
                  className="w-full py-2.5 px-4 border border-slate-300 text-slate-700 font-semibold rounded-xl text-center text-sm flex items-center justify-center gap-2"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Firebase Settings Modal */}
      <FirebaseSettingsModal
        isOpen={showFirebaseModal}
        onClose={() => setShowFirebaseModal(false)}
      />
    </>
  );
};

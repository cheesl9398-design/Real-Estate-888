import React, { useState } from 'react';
import {
  LayoutDashboard,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  Filter,
  Building,
  TrendingUp,
  User,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  ChevronRight,
  List,
  Grid
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { Property, PropertyStatus, Inquiry } from '../types/property';

export const AgentDashboardPage: React.FC = () => {
  const {
    properties,
    deleteProperty,
    updateProperty,
    inquiries,
    updateInquiryStatus,
    navigateTo,
    resetToDemoData
  } = useProperties();
  const { user, activeAgent, signInWithGoogle, signInAsDemoAgent } = useAuth();

  const [activeTab, setActiveTab] = useState<'listings' | 'inquiries'>('listings');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter listings by current agent (or all if demo)
  const agentListings = properties.filter(p => {
    // If agent is logged in, show their listings or fallback to all for demo testing
    if (user && p.agent.id === user.uid) return true;
    return true; // Show all in demo mode so agent sees comprehensive data
  });

  const filteredListings = agentListings.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
    }
    return true;
  });

  // KPI metrics
  const activeCount = agentListings.filter(p => p.status === 'active').length;
  const totalViews = agentListings.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  const totalInquiries = inquiries.length;
  const soldOrRentedCount = agentListings.filter(p => p.status === 'sold' || p.status === 'rented').length;

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    await deleteProperty(deletingId);
    setDeletingId(null);
  };

  const handleStatusChange = async (property: Property, newStatus: PropertyStatus) => {
    await updateProperty({ ...property, status: newStatus });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={
                  activeAgent?.photoUrl ||
                  user?.photoURL ||
                  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'
                }
                alt={activeAgent?.name || 'Agent'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-100 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {activeAgent?.name || user?.displayName || 'Agent Portal'}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> CEA Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {activeAgent?.agency || 'PropNex Premier Division'} • Lic: {activeAgent?.licenseNumber || 'R048291B'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {user?.email || 'agent@estateguru.pro'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => resetToDemoData()}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
              title="Reset all listings to initial demo state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>

            <button
              onClick={() => navigateTo('agent-new-listing')}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Listing</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Active Listings</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Building className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{activeCount}</div>
            <span className="text-[11px] text-emerald-600 font-medium">Published on portal</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Total Page Views</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{totalViews.toLocaleString()}</div>
            <span className="text-[11px] text-slate-400 font-medium">High buyer engagement</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Inquiries / Leads</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{totalInquiries}</div>
            <span className="text-[11px] text-amber-600 font-medium">Viewing requests</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Closed / Rented</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{soldOrRentedCount}</div>
            <span className="text-[11px] text-emerald-600 font-medium">Successful transactions</span>
          </div>
        </div>

        {/* Tab Switcher: My Listings vs Inquiries */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('listings')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  activeTab === 'listings'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                My Listings ({agentListings.length})
              </button>
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'inquiries'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Viewing Inquiries</span>
                {inquiries.length > 0 && (
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      activeTab === 'inquiries'
                        ? 'bg-white text-rose-600'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {inquiries.length}
                  </span>
                )}
              </button>
            </div>

            {activeTab === 'listings' && (
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search my listings..."
                    className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-rose-500 w-48 sm:w-60"
                  />
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 transition ${viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    title="Table view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`p-1.5 transition ${viewMode === 'cards' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    title="Card grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TAB 1: MY LISTINGS */}
          {activeTab === 'listings' && (
            <div className="p-6">
              {/* Status Pills */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { label: 'All Listings', value: 'all' },
                  { label: 'Active', value: 'active' },
                  { label: 'Pending Offer', value: 'pending' },
                  { label: 'Sold', value: 'sold' },
                  { label: 'Rented', value: 'rented' },
                ].map(status => (
                  <button
                    key={status.value}
                    onClick={() => setStatusFilter(status.value)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                      statusFilter === status.value
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>

              {filteredListings.length > 0 ? (
                viewMode === 'table' ? (
                  /* Table View */
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                          <th className="pb-3 pl-2">Property</th>
                          <th className="pb-3">Type & Specs</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Views / Leads</th>
                          <th className="pb-3 text-right pr-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredListings.map(prop => (
                          <tr key={prop.id} className="hover:bg-slate-50/80 transition">
                            {/* Property Info */}
                            <td className="py-3.5 pl-2">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prop.images[0]}
                                  alt={prop.title}
                                  className="w-14 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                                <div className="min-w-0 max-w-xs">
                                  <h4
                                    onClick={() => navigateTo('detail', prop.id)}
                                    className="font-bold text-slate-900 truncate hover:text-rose-600 transition cursor-pointer"
                                  >
                                    {prop.title}
                                  </h4>
                                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                    {prop.address} • {prop.district}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Type & Specs */}
                            <td className="py-3.5">
                              <span className="font-semibold text-slate-700 capitalize">
                                {prop.propertyType}
                              </span>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {prop.bedrooms}b • {prop.bathrooms}ba • {prop.floorAreaSqft.toLocaleString()} sqft
                              </div>
                            </td>

                            {/* Price */}
                            <td className="py-3.5">
                              <span className="font-extrabold text-slate-900 text-sm">
                                S${prop.price.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400 block capitalize">
                                For {prop.listingType}
                              </span>
                            </td>

                            {/* Status dropdown */}
                            <td className="py-3.5">
                              <select
                                value={prop.status}
                                onChange={e =>
                                  handleStatusChange(prop, e.target.value as PropertyStatus)
                                }
                                className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer outline-none ${
                                  prop.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : prop.status === 'pending'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-slate-100 text-slate-700 border-slate-300'
                                }`}
                              >
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="sold">Sold</option>
                                <option value="rented">Rented</option>
                              </select>
                            </td>

                            {/* Metrics */}
                            <td className="py-3.5">
                              <div className="flex items-center gap-3 text-slate-600 font-medium text-[11px]">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                                  {prop.viewsCount || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
                                  {prop.inquiriesCount || 0}
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 text-right pr-2">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => navigateTo('detail', prop.id)}
                                  className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                                  title="View Public Page"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => navigateTo('agent-edit-listing', prop.id)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                  title="Edit Listing"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeletingId(prop.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Delete Listing"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Card Grid View */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map(prop => (
                      <div
                        key={prop.id}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-[16/10] bg-slate-100">
                            <img
                              src={prop.images[0]}
                              alt={prop.title}
                              className="w-full h-full object-cover"
                            />
                            <span
                              className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded capitalize ${
                                prop.status === 'active'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-900 text-white'
                              }`}
                            >
                              {prop.status}
                            </span>
                          </div>
                          <div className="p-4 space-y-2">
                            <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                              {prop.title}
                            </h4>
                            <p className="text-xs text-rose-600 font-extrabold">
                              S${prop.price.toLocaleString()} ({prop.listingType})
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">{prop.address}</p>
                          </div>
                        </div>

                        <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">
                            {prop.viewsCount} Views • {prop.inquiriesCount} Leads
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigateTo('agent-edit-listing', prop.id)}
                              className="p-1 text-slate-500 hover:text-blue-600 rounded"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingId(prop.id)}
                              className="p-1 text-slate-500 hover:text-red-600 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No listings found matching criteria.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INQUIRIES & VIEWING LEADS */}
          {activeTab === 'inquiries' && (
            <div className="p-6">
              {inquiries.length > 0 ? (
                <div className="space-y-4">
                  {inquiries.map(inq => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 min-w-0 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">
                            {inq.userName}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-600 font-medium">
                            {inq.userEmail}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-600 font-mono">
                            {inq.userPhone}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-rose-600 truncate">
                          Listing: {inq.propertyTitle} (S${inq.propertyPrice?.toLocaleString()})
                        </p>

                        <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                          &quot;{inq.message}&quot;
                        </p>

                        {inq.preferredDate && (
                          <div className="flex items-center gap-4 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-rose-500" />
                              Requested Date: {inq.preferredDate}
                            </span>
                            {inq.preferredTimeSlot && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-rose-500" />
                                Slot: {inq.preferredTimeSlot}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Status and Action Buttons */}
                      <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
                        <select
                          value={inq.status}
                          onChange={e =>
                            updateInquiryStatus(inq.id, e.target.value as Inquiry['status'])
                          }
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer ${
                            inq.status === 'new'
                              ? 'bg-rose-50 text-rose-700 border-rose-300'
                              : inq.status === 'contacted'
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : inq.status === 'scheduled'
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          }`}
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Contacted</option>
                          <option value="scheduled">Viewing Scheduled</option>
                          <option value="closed">Closed / Finished</option>
                        </select>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${inq.userPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                          <a
                            href={`mailto:${inq.userEmail}?subject=EstateGuru Inquiry: ${encodeURIComponent(inq.propertyTitle)}`}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Reply Email</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No viewing inquiries received yet. Prospects can contact you via the public listing pages.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Delete Property Listing?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to remove this property? This will delete the listing from the public portal and Firestore database.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

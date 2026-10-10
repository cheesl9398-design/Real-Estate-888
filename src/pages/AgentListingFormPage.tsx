import React, { useState, useEffect } from 'react';
import {
  Building2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  Upload,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Eye,
  Save,
  Link,
  Video
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { ALL_AMENITIES, DISTRICTS } from '../data/initialProperties';
import { Property, PropertyType, ListingType, PropertyStatus } from '../types/property';

interface AgentListingFormPageProps {
  editPropertyId?: string | null;
}

const PRESET_PHOTOS = [
  { label: 'Luxury Living Room', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modern Master Suite', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Gourmet Kitchen', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Pool & Terrace Deck', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Marina Bay Skyline', url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Architectural Exterior', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Marble En-suite Bath', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Grade A Office Floor', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80' },
];

export const AgentListingFormPage: React.FC<AgentListingFormPageProps> = ({ editPropertyId }) => {
  const { addProperty, updateProperty, getPropertyById, navigateTo } = useProperties();
  const { user, activeAgent, signInWithGoogle } = useAuth();

  const isEditing = !!editPropertyId;
  const existingProp = editPropertyId ? getPropertyById(editPropertyId) : null;

  // Form states
  const [title, setTitle] = useState(existingProp?.title || '');
  const [price, setPrice] = useState<number | ''>(existingProp?.price || '');
  const [listingType, setListingType] = useState<ListingType>(existingProp?.listingType || 'sale');
  const [propertyType, setPropertyType] = useState<PropertyType>(existingProp?.propertyType || 'condo');
  const [bedrooms, setBedrooms] = useState<number>(existingProp?.bedrooms ?? 3);
  const [bathrooms, setBathrooms] = useState<number>(existingProp?.bathrooms ?? 2);
  const [floorAreaSqft, setFloorAreaSqft] = useState<number | ''>(existingProp?.floorAreaSqft || 1200);
  const [address, setAddress] = useState(existingProp?.address || '');
  const [district, setDistrict] = useState(existingProp?.district || 'D01 - Marina Bay / Downtown');
  const [postalCode, setPostalCode] = useState(existingProp?.postalCode || '');
  const [description, setDescription] = useState(existingProp?.description || '');
  const [tenure, setTenure] = useState<'Freehold' | '99-year Leasehold' | '999-year Leasehold'>(
    existingProp?.tenure || '99-year Leasehold'
  );
  const [yearBuilt, setYearBuilt] = useState<number>(existingProp?.yearBuilt || 2022);
  const [furnishing, setFurnishing] = useState<'Fully Furnished' | 'Partially Furnished' | 'Unfurnished'>(
    existingProp?.furnishing || 'Partially Furnished'
  );
  const [status, setStatus] = useState<PropertyStatus>(existingProp?.status || 'active');
  const [featured, setFeatured] = useState<boolean>(existingProp?.featured || false);
  const [virtualTourUrl, setVirtualTourUrl] = useState(existingProp?.virtualTourUrl || '');
  const [amenities, setAmenities] = useState<string[]>(
    existingProp?.amenities || [
      'Swimming Pool',
      'Gymnasium',
      '24h Security & Guardhouse',
      'Near MRT / Transit',
      'Covered Parking'
    ]
  );
  const [images, setImages] = useState<string[]>(
    existingProp?.images && existingProp.images.length > 0
      ? existingProp.images
      : [PRESET_PHOTOS[0].url, PRESET_PHOTOS[1].url]
  );

  const [customImageUrl, setCustomImageUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingProp) {
      setTitle(existingProp.title);
      setPrice(existingProp.price);
      setListingType(existingProp.listingType);
      setPropertyType(existingProp.propertyType);
      setBedrooms(existingProp.bedrooms);
      setBathrooms(existingProp.bathrooms);
      setFloorAreaSqft(existingProp.floorAreaSqft);
      setAddress(existingProp.address);
      setDistrict(existingProp.district);
      setPostalCode(existingProp.postalCode || '');
      setDescription(existingProp.description);
      setTenure(existingProp.tenure || '99-year Leasehold');
      setYearBuilt(existingProp.yearBuilt || 2022);
      setFurnishing(existingProp.furnishing || 'Partially Furnished');
      setStatus(existingProp.status);
      setFeatured(existingProp.featured || false);
      setVirtualTourUrl(existingProp.virtualTourUrl || '');
      setAmenities(existingProp.amenities);
      setImages(existingProp.images);
    }
  }, [existingProp]);

  // Image helpers
  const handleAddCustomImageUrl = () => {
    if (!customImageUrl.trim()) return;
    setImages(prev => [...prev, customImageUrl.trim()]);
    setCustomImageUrl('');
  };

  const handleAddPresetPhoto = (url: string) => {
    if (!images.includes(url)) {
      setImages(prev => [...prev, url]);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Please enter a listing title.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg('Please enter a valid price.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter a property street address.');
      return;
    }
    if (images.length === 0) {
      setErrorMsg('Please upload or select at least 1 property photograph.');
      return;
    }

    setSaving(true);
    try {
      const defaultAgent = activeAgent || {
        id: user?.uid || 'agent-marcus',
        name: user?.displayName || 'Marcus Chen',
        email: user?.email || 'marcus.chen@estateguru.pro',
        phone: user?.phoneNumber || '+65 9876 5432',
        photoUrl: user?.photoURL || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
        agency: 'ERA Luxury Homes Division',
        licenseNumber: 'R019842C',
        rating: 4.98,
        reviewsCount: 215,
      };

      if (isEditing && existingProp) {
        await updateProperty({
          ...existingProp,
          title: title.trim(),
          price: Number(price),
          listingType,
          propertyType,
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          floorAreaSqft: Number(floorAreaSqft) || 1000,
          address: address.trim(),
          district,
          city: 'Singapore',
          postalCode: postalCode.trim() || undefined,
          description: description.trim(),
          tenure,
          yearBuilt: Number(yearBuilt) || 2022,
          furnishing,
          amenities,
          images,
          status,
          featured,
          virtualTourUrl: virtualTourUrl.trim() || undefined,
        });
      } else {
        await addProperty({
          title: title.trim(),
          price: Number(price),
          listingType,
          propertyType,
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          floorAreaSqft: Number(floorAreaSqft) || 1000,
          address: address.trim(),
          district,
          city: 'Singapore',
          postalCode: postalCode.trim() || undefined,
          description: description.trim(),
          tenure,
          yearBuilt: Number(yearBuilt) || 2022,
          furnishing,
          amenities,
          images,
          agent: defaultAgent,
          status,
          featured,
          verified: true,
          virtualTourUrl: virtualTourUrl.trim() || undefined,
        });
      }

      navigateTo('agent-dashboard');
    } catch (err: unknown) {
      console.error('Error saving property:', err);
      setErrorMsg('Failed to save property. Please check inputs and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back and Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateTo('agent-dashboard')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <span className="text-xs text-slate-400">Agent Hub • Real Estate Listing Publisher</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card Top Title Banner */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">
                {isEditing ? 'Edit Property Listing' : 'Publish New Property Listing'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {isEditing
                  ? 'Update listing details, pricing, amenities or media assets'
                  : 'Add a new verified property to the EstateGuru public portal and Firestore database'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 text-rose-400">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">1</span>
                Basic Information
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Listing Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Marina One Residences | Luxury Sea View 3-Bedroom with Private Lift"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Listing Type *
                  </label>
                  <select
                    value={listingType}
                    onChange={e => setListingType(e.target.value as ListingType)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    value={propertyType}
                    onChange={e => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="condo">Condominium</option>
                    <option value="landed">Landed House / Villa</option>
                    <option value="apartment">HDB & Apartment</option>
                    <option value="commercial">Commercial / Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Listing Status *
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as PropertyStatus)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="active">Active (Published)</option>
                    <option value="pending">Pending Offer</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Specs */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">2</span>
                Pricing & Property Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price (SGD) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder={listingType === 'sale' ? 'e.g. 2850000' : 'e.g. 6500'}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={bedrooms}
                    onChange={e => setBedrooms(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={bathrooms}
                    onChange={e => setBathrooms(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Floor Area (Sqft) *
                  </label>
                  <input
                    type="number"
                    value={floorAreaSqft}
                    onChange={e => setFloorAreaSqft(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 1250"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tenure
                  </label>
                  <select
                    value={tenure}
                    onChange={e => setTenure(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="Freehold">Freehold</option>
                    <option value="99-year Leasehold">99-year Leasehold</option>
                    <option value="999-year Leasehold">999-year Leasehold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Year Built
                  </label>
                  <input
                    type="number"
                    min={1960}
                    max={2032}
                    value={yearBuilt}
                    onChange={e => setYearBuilt(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Furnishing
                  </label>
                  <select
                    value={furnishing}
                    onChange={e => setFurnishing(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Partially Furnished">Partially Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Location Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">3</span>
                Location & Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address / Condo Name *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="e.g. 21 Marina Way, District 01"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    placeholder="e.g. 018978"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  District Zone *
                </label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-white cursor-pointer"
                >
                  {DISTRICTS.filter(d => d !== 'All Districts').map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 4: Description & Virtual Tour */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">4</span>
                Description & Virtual Tour
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detail the layout, architectural highlights, premium kitchen appliances, view orientation, and transportation advantages..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    3D Virtual Tour URL (Matterport / 360 link)
                  </label>
                  <input
                    type="url"
                    value={virtualTourUrl}
                    onChange={e => setVirtualTourUrl(e.target.value)}
                    placeholder="https://my.matterport.com/show/?m=..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={e => setFeatured(e.target.checked)}
                      className="w-4 h-4 accent-rose-600 rounded"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Feature on Home Page Carousel
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 5: Amenities */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">5</span>
                Amenities & Facilities
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {ALL_AMENITIES.map(amenity => {
                  const selected = amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between text-left transition ${
                        selected
                          ? 'bg-rose-50 border-rose-400 text-rose-800 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{amenity}</span>
                      {selected && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 6: Media & Image Upload Placeholder */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">6</span>
                Property Photos & Media ({images.length} added)
              </h3>

              {/* Upload Dropzone Placeholder */}
              <div className="border-2 border-dashed border-slate-300 hover:border-rose-400 rounded-2xl p-6 text-center transition bg-slate-50/50">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">
                  Upload High-Resolution Property Photos
                </h4>
                <p className="text-[11px] text-slate-500 mb-3">
                  PNG, JPG, or WEBP up to 10MB each. First photo acts as the primary hero thumbnail.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition">
                  <ImageIcon className="w-4 h-4" />
                  <span>Choose Files from Device</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Custom URL Input */}
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={e => setCustomImageUrl(e.target.value)}
                  placeholder="Or paste an image web URL: https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomImageUrl}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl shrink-0 transition"
                >
                  Add URL
                </button>
              </div>

              {/* Preset One-Click Photo Picker */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                  Quick Architecture Presets (Click to Add):
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPresetPhoto(preset.url)}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 border border-slate-200 transition"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Thumbnails Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden aspect-[4/3] group border border-slate-200"
                    >
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 hover:bg-red-600 text-white transition opacity-0 group-hover:opacity-100"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigateTo('agent-dashboard')}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition disabled:opacity-70 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Publishing to Firestore...' : isEditing ? 'Save Changes' : 'Publish Listing'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

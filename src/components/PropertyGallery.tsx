import React, { useState } from 'react';
import { Grid, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'
  ];

  const openLightboxAt = (idx: number) => {
    setActivePhotoIndex(idx);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setActivePhotoIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setActivePhotoIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <>
      {/* 5-Photo Hero Grid Layout (PropertyGuru / Airbnb Style) */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 aspect-[16/9] md:aspect-[2.2/1] max-h-[520px]">
          {/* Main Large Image (Left 2 cols) */}
          <div
            onClick={() => openLightboxAt(0)}
            className="md:col-span-2 relative h-full overflow-hidden cursor-pointer group"
          >
            <img
              src={displayImages[0]}
              alt={`${title} - Main Photo`}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
          </div>

          {/* Right 2x2 Image Grid */}
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
            {displayImages.slice(1, 5).map((img, index) => {
              const actualIdx = index + 1;
              return (
                <div
                  key={actualIdx}
                  onClick={() => openLightboxAt(actualIdx)}
                  className="relative h-full overflow-hidden cursor-pointer group"
                >
                  <img
                    src={img}
                    alt={`${title} - Photo ${actualIdx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
                </div>
              );
            })}
          </div>
        </div>

        {/* View All Photos Button */}
        <button
          onClick={() => openLightboxAt(0)}
          className="absolute bottom-4 right-4 px-4 py-2 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl backdrop-blur-md shadow-lg flex items-center gap-2 transition cursor-pointer"
        >
          <Grid className="w-4 h-4" />
          <span>View All {displayImages.length} Photos</span>
        </button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full pb-4 border-b border-white/10">
            <div>
              <p className="text-sm font-semibold truncate max-w-md">{title}</p>
              <span className="text-xs text-slate-400">
                Photo {activePhotoIndex + 1} of {displayImages.length}
              </span>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Main Stage */}
          <div className="relative flex-1 flex items-center justify-center max-w-6xl mx-auto w-full py-4">
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={displayImages[activePhotoIndex]}
              alt={`Photo ${activePhotoIndex + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl select-none"
            />

            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="max-w-4xl mx-auto w-full overflow-x-auto py-2 flex items-center justify-center gap-2">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                  activePhotoIndex === idx
                    ? 'border-rose-500 scale-105'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

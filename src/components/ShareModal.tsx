import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Mail, Share2 } from 'lucide-react';
import { Property } from '../types/property';

interface ShareModalProps {
  property: Property | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ property, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!property) return null;

  const url = `${window.location.origin}/#property/${property.id}`;
  const shareTitle = `${property.title} | EstateGuru`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out this listing: ${property.title} (S$${property.price.toLocaleString()}) - ${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Property Listing: ${property.title}`);
    const body = encodeURIComponent(`Take a look at this property listing on EstateGuru:\n\n${property.title}\nPrice: S$${property.price.toLocaleString()}\nLocation: ${property.address}\n\nView details: ${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Share2 className="w-4 h-4 text-rose-600" />
            <span>Share Listing</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{property.title}</h5>
              <p className="text-xs text-rose-600 font-extrabold mt-0.5">
                S${property.price.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{property.address}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Listing Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={url}
                className="w-full text-xs font-mono px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg select-all outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleWhatsAppShare}
              className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleEmailShare}
              className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Mail className="w-4 h-4 text-slate-600" />
              <span>Email Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

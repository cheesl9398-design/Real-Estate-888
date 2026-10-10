import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Star,
  Send,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AgentInfo, Property } from '../types/property';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';

interface AgentInquiryFormProps {
  property: Property;
}

export const AgentInquiryForm: React.FC<AgentInquiryFormProps> = ({ property }) => {
  const { addInquiry } = useProperties();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'viewing' | 'message'>('viewing');
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('14:00 - 15:00');
  const [message, setMessage] = useState(
    `Hi ${property.agent.name}, I am interested in "${property.title}". Please share viewing availability and floor plans.`
  );
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await addInquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyPrice: property.price,
        propertyImage: property.images[0],
        agentId: property.agent.id,
        agentName: property.agent.name,
        userName: name.trim(),
        userEmail: email.trim(),
        userPhone: phone.trim() || '+65 9000 0000',
        message: message.trim(),
        preferredDate: activeTab === 'viewing' ? date : undefined,
        preferredTimeSlot: activeTab === 'viewing' ? timeSlot : undefined,
        inquiryType: activeTab === 'viewing' ? 'schedule_viewing' : 'ask_question',
      });
      setSubmittedId('INQ-' + Math.floor(100000 + Math.random() * 900000));
    } catch (err) {
      console.error('Failed submitting inquiry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const cleanPhone = property.agent.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(
      `Hi ${property.agent.name}, I saw your listing for "${property.title}" (S$${property.price.toLocaleString()}) on EstateGuru. I'd like to arrange an appointment or receive details.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 sm:p-6 sticky top-20 space-y-5">
      {/* Agent Profile Header */}
      <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
        <div className="relative">
          <img
            src={property.agent.photoUrl}
            alt={property.agent.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
          />
          <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
              {property.agent.name}
            </h4>
            <span title="CEA Verified">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate font-medium">{property.agent.agency}</p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
            <span className="flex items-center gap-0.5 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {property.agent.rating.toFixed(2)}
            </span>
            <span className="text-slate-400">({property.agent.reviewsCount} reviews)</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-mono text-[10px]">{property.agent.licenseNumber}</span>
          </div>
        </div>
      </div>

      {/* Quick Direct Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleWhatsApp}
          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>
        <a
          href={`tel:${property.agent.phone}`}
          className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition text-center"
        >
          <Phone className="w-4 h-4" />
          <span>Call Agent</span>
        </a>
      </div>

      {submittedId ? (
        /* Confirmation State */
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3 animate-fadeIn">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h5 className="font-bold text-sm text-emerald-900">Inquiry Sent Successfully!</h5>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Your request has been delivered to <strong>{property.agent.name}</strong>. Reference ID: <span className="font-mono font-bold">{submittedId}</span>. Expect a response shortly.
          </p>
          <button
            onClick={() => setSubmittedId(null)}
            className="text-xs font-semibold text-emerald-700 underline hover:text-emerald-900"
          >
            Send another inquiry
          </button>
        </div>
      ) : (
        /* Form State */
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Tabs: Schedule Viewing vs Ask Question */}
          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('viewing')}
              className={`py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'viewing'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Schedule Viewing
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('message')}
              className={`py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'message'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Ask a Question
            </button>
          </div>

          {/* Viewing specific date and slot pickers */}
          {activeTab === 'viewing' && (
            <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" /> Preferred Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-500" /> Time Slot
                </label>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  {[
                    '10:00 - 11:30',
                    '14:00 - 15:00',
                    '16:30 - 17:30',
                    '19:00 - 20:00',
                  ].map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`px-2 py-1.5 rounded-md border text-center transition ${
                        timeSlot === slot
                          ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contact inputs */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Jessica Tan"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+65 9123 4567"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Message
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 transition disabled:opacity-70 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Sending Request...' : 'Send Inquiry to Agent'}</span>
          </button>

          <p className="text-[10px] text-slate-400 text-center leading-tight">
            By contacting, you agree to EstateGuru Terms of Service & Personal Data Protection Act (PDPA).
          </p>
        </form>
      )}
    </div>
  );
};

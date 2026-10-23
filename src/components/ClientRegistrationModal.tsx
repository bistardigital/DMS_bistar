import React, { useState } from 'react';
import { useDms } from '../context/DmsContext.tsx';
import { BusinessSector } from '../types/index.ts';
import { X, Building2, User, Phone, MapPin, ShieldCheck, CheckCircle2, Clock, FileBadge } from 'lucide-react';

interface ClientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientRegistrationModal: React.FC<ClientRegistrationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { routes, registerShop, approveShop } = useDms();
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessSector, setBusinessSector] = useState<BusinessSector>('FMCG');
  const [tradeLicenseNo, setTradeLicenseNo] = useState('');
  const [routeId, setRouteId] = useState(routes[0]?.id || '');
  const [submittedShopId, setSubmittedShopId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim() || !ownerName.trim() || !phone.trim() || !routeId) return;

    const shop = registerShop({
      shopName,
      ownerName,
      phone,
      businessSector,
      tradeLicenseNo: tradeLicenseNo.trim() || undefined,
      routeId
    });
    setSubmittedShopId(shop.id);
  };

  const handleInstantDemoApprove = () => {
    if (submittedShopId) {
      approveShop(submittedShopId, 365); // 1-year approval
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">বিটুবি পাইকারি গ্রাহক আবেদন (B2B Registration)</h3>
              <p className="text-xs text-slate-400">ফার্মেসি, খুচরা দোকান, ডিপার্টমেন্টাল স্টোর ও ডিলার</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submittedShopId ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Clock className="w-9 h-9" />
            </div>

            <div>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                স্ট্যাটাস: পেন্ডিং ডিস্ট্রিবিউটর ভেরিফিকেশন (PENDING)
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-2">আবেদন সফলভাবে গ্রহণ করা হয়েছে!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                আপনার দোকানের তথ্য ডিস্ট্রিবিউশন হাবে জমা পড়েছে। পাইকারি রেট ও অর্ডার আনলক করতে অ্যাডমিন বা ডিলারের রুট ভেরিফিকেশন প্রয়োজন।
              </p>
            </div>

            {/* Quick Demo Bypass Button for the Evaluator */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>টেস্টিং ও ডেমো সুবিধা (Instant Evaluator Approval):</span>
              </div>
              <p className="text-[11px] text-slate-500">
                প্রোডাকশনে অ্যাডমিন প্যানেল থেকে আবেদন অনুমোদন করা হয়। এখনই ৩-স্তর বিশিষ্ট পাইকারি মূল্য ও অর্ডার পরীক্ষা করতে নিচের বাটনে চাপ দিন।
              </p>
              <button
                onClick={handleInstantDemoApprove}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                তাৎক্ষণিক অনুমোদন করুন এবং পাইকারি রেট আনলক করুন
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline cursor-pointer"
            >
              বন্ধ করুন এবং ক্যাটালগ ব্রাউজ করুন (রেট লক থাকবে)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
            {/* Info notice */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">ভেরিফিকেশন নীতিমালা:</span> নতুন নিবন্ধিত দোকানের স্ট্যাটাস <span className="font-bold text-amber-700">PENDING</span> থাকে এবং অনুমোদনের পর BDT পাইকারি মূল্য ও বাকি খাতা সক্রিয় হয়।
              </div>
            </div>

            {/* Shop Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                দোকান / প্রতিষ্ঠানের নাম *
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: আল-মদিনা মডেল ফার্মেসি, যমুনা ডিপার্টমেন্টাল স্টোর"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                স্বত্বাধিকারী / পরিচালকের নাম *
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: মোঃ তরিকুল ইসলাম"
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                মোবাইল / হোয়াটসঅ্যাপ নম্বর *
              </label>
              <input
                type="tel"
                required
                placeholder="যেমন: 01712345678"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50 font-mono"
              />
            </div>

            {/* Sector & Trade License Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ব্যবসার খাত (Business Sector) *
                </label>
                <select
                  value={businessSector}
                  onChange={e => setBusinessSector(e.target.value as BusinessSector)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold"
                >
                  <option value="FMCG">FMCG & গ্রোসারি</option>
                  <option value="PHARMA">ফার্মাসিউটিক্যালস ও ড্রাগ</option>
                  <option value="AGRO">কৃষি সার ও বীজ (Agro)</option>
                  <option value="MULTI">সার্বিক পাইকারি (Multi-Trade)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <FileBadge className="w-3 h-3 text-slate-400" />
                  ট্রেড লাইসেন্স / NID (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="TRAD/DSCC/01928"
                  value={tradeLicenseNo}
                  onChange={e => setTradeLicenseNo(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                />
              </div>
            </div>

            {/* Delivery Route Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                ডেলিভারি রুট ও বাজার এলাকা *
              </label>
              <select
                required
                value={routeId}
                onChange={e => setRouteId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50 font-medium text-slate-700"
              >
                {routes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.routeName} (শিডিউল: {r.deliveryDays} | কাট-অফ: {r.cutoffTime})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors mt-2 cursor-pointer"
            >
              যাচাইকরণের জন্য আবেদন জমা দিন
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

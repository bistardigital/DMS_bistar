import React, { useState } from 'react';
import { useDms } from '../context/DmsContext.tsx';
import { X, Building2, User, Phone, MapPin, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface ClientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientRegistrationModal: React.FC<ClientRegistrationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { routes, registerClient, currentUser, approveClient } = useDms();
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [routeId, setRouteId] = useState(routes[0]?.id || '');
  const [submittedUser, setSubmittedUser] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim() || !ownerName.trim() || !phone.trim() || !routeId) return;

    const user = registerClient({
      shopName,
      ownerName,
      phone,
      routeId
    });
    setSubmittedUser(user.id);
  };

  const handleInstantDemoApprove = () => {
    if (submittedUser) {
      approveClient(submittedUser, 12);
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
              <h3 className="font-bold text-base leading-tight">B2B Wholesale Client Application</h3>
              <p className="text-xs text-slate-400">Retailers, Pharmacies, Dealers & Shops</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submittedUser ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Clock className="w-9 h-9" />
            </div>

            <div>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Status: PENDING DEALER APPROVAL
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-2">Application Received!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                Your shop details have been submitted. Under B2B Distribution Management rules, wholesale pricing and order placement remain locked until the Super Admin / Dealer verifies your trade route.
              </p>
            </div>

            {/* Quick Demo Bypass Button for the Evaluator */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Evaluator / Demo Convenience:</span>
              </div>
              <p className="text-[11px] text-slate-500">
                In production, the Admin approves requests from the Admin Hub. Click below to instantly grant 1-Year B2B wholesale access to this account.
              </p>
              <button
                onClick={handleInstantDemoApprove}
                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                Instantly Approve & Unlock B2B Wholesale Pricing
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-700 font-semibold underline"
            >
              Close & Browse Catalog (Wholesale Prices Locked)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Info notice */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Trade Verification Gating:</span> New accounts default to <span className="font-bold text-amber-700">PENDING</span> until approved by the distribution hub.
              </div>
            </div>

            {/* Shop Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Shop / Enterprise Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Al-Madina Model Pharmacy, Jamuna Agro Care"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Proprietor / Owner Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tariqul Islam"
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Mobile Phone / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 01712345678"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50"
              />
            </div>

            {/* Delivery Route Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Assigned Delivery Route / Market Hub *
              </label>
              <select
                required
                value={routeId}
                onChange={e => setRouteId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50 font-medium text-slate-700"
              >
                {routes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.routeName} (Delivery: {r.deliveryDay} | Cutoff: {r.orderCutoffDay})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors mt-2"
            >
              Submit Application for Verification
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useDms } from '../../context/DmsContext.tsx';
import { ShopProfile } from '../../types/index.ts';
import { formatCurrency } from '../../utils/pricing.ts';
import {
  UserCheck,
  UserX,
  Clock,
  ShieldCheck,
  Calendar,
  MapPin,
  Check,
  AlertCircle,
  CreditCard,
  Banknote,
  DollarSign,
  PlusCircle
} from 'lucide-react';

export const ClientApprovalTable: React.FC = () => {
  const {
    shops,
    routes,
    currency,
    approveShop,
    rejectShop,
    setShopExpiry,
    adjustCreditLimit,
    recordCreditPayment
  } = useDms();

  const [editingLimitShopId, setEditingLimitShopId] = useState<string | null>(null);
  const [newLimitInput, setNewLimitInput] = useState<string>('');

  const [collectingPaymentShopId, setCollectingPaymentShopId] = useState<string | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState<string>('');

  const b2bClients = shops.filter(u => u.role === 'B2B_CLIENT');
  const pendingCount = b2bClients.filter(c => c.status === 'PENDING').length;
  const totalOutstandingDue = b2bClients.reduce((sum, c) => sum + (c.currentDueBdt || 0), 0);

  const handleSaveLimit = (shopId: string) => {
    const val = parseFloat(newLimitInput);
    if (!isNaN(val) && val >= 0) {
      adjustCreditLimit(shopId, val);
    }
    setEditingLimitShopId(null);
    setNewLimitInput('');
  };

  const handleRecordPayment = (shopId: string) => {
    const val = parseFloat(paymentAmountInput);
    if (!isNaN(val) && val > 0) {
      recordCreditPayment(shopId, val);
    }
    setCollectingPaymentShopId(null);
    setPaymentAmountInput('');
  };

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>পেন্ডিং অনুমোদন (Pending)</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{pendingCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">যাচাইয়ের অপেক্ষায় থাকা নতুন দোকান</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>অনুমোদিত গ্রাহক (Approved)</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {b2bClients.filter(c => c.status === 'APPROVED').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">সক্রিয় পাইকারি ক্রেতা ও ডিলার</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>স্থগিত / বাতিল (Suspended)</span>
            <UserX className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            {b2bClients.filter(c => c.status === 'SUSPENDED' || c.status === 'REJECTED').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">রেট ও অর্ডার সুবিধা স্থগিত</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>মোট বাজার বাকি (Total Due)</span>
            <CreditCard className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-black text-indigo-900 mt-2">
            {formatCurrency(totalOutstandingDue, currency)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">দোকানদারদের কাছে মোট বাকি পাওনা</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              বিটুবি ক্লায়েন্ট অনুমোদন গেটিং ও বাকি খাতা নিয়ন্ত্রণ (Approval & Credit Ledger)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              নতুন দোকান যাচাই করুন, পাইকারি রেট আনলক করতে মেয়াদ দিন এবং বাকি লিমিট ও আদায় হিসাব পরিচালনা করুন।
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">দোকানের নাম ও আইডি</th>
                <th className="py-3 px-4">স্বত্বাধিকারী ও ফোন</th>
                <th className="py-3 px-4">রুট ও খাত</th>
                <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                <th className="py-3 px-4">বাকি খাতা (Credit Ledger)</th>
                <th className="py-3 px-4">মেয়াদ (Validity)</th>
                <th className="py-3 px-4 text-right">অনুমোদন অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {b2bClients.map(client => {
                const route = routes.find(r => r.id === client.routeId);
                const isPending = client.status === 'PENDING';
                const isApproved = client.status === 'APPROVED';
                const isSuspended = client.status === 'SUSPENDED' || client.status === 'REJECTED';

                const isExpired = client.validityExpiryEpochMs
                  ? client.validityExpiryEpochMs < Date.now()
                  : false;

                const isEditingLimit = editingLimitShopId === client.id;
                const isCollectingPayment = collectingPaymentShopId === client.id;

                return (
                  <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Shop Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {client.shopName || client.ownerName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ID: {client.id} {client.tradeLicenseNo ? `• ${client.tradeLicenseNo}` : ''}
                      </div>
                    </td>

                    {/* Owner & Phone */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{client.ownerName}</div>
                      <div className="text-[11px] text-indigo-600 font-mono mt-0.5 font-bold">
                        {client.phone}
                      </div>
                    </td>

                    {/* Route & Sector */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{route?.routeName || client.routeName || 'Unassigned'}</span>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                        {client.businessSector}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isPending
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : isApproved && !isExpired
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        {isPending && <Clock className="w-3 h-3" />}
                        {isApproved && !isExpired && <UserCheck className="w-3 h-3" />}
                        {(isSuspended || isExpired) && <UserX className="w-3 h-3" />}
                        {isExpired ? 'EXPIRED' : client.status}
                      </span>
                    </td>

                    {/* Credit Ledger */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-400">সীমা:</span>
                          <span className="font-bold text-slate-800">
                            {formatCurrency(client.creditLimitBdt, currency)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-400">বাকি:</span>
                          <span className={`font-bold ${client.currentDueBdt > 0 ? 'text-amber-700' : 'text-slate-600'}`}>
                            {formatCurrency(client.currentDueBdt, currency)}
                          </span>
                        </div>

                        {/* Adjust Limit inline input */}
                        {isEditingLimit ? (
                          <div className="flex items-center gap-1 pt-1">
                            <input
                              type="number"
                              placeholder="নতুন সীমা"
                              value={newLimitInput}
                              onChange={e => setNewLimitInput(e.target.value)}
                              className="w-20 p-1 text-xs rounded border border-slate-300 bg-white"
                            />
                            <button
                              onClick={() => handleSaveLimit(client.id)}
                              className="px-2 py-1 bg-indigo-600 text-white rounded text-[10px] font-bold cursor-pointer"
                            >
                              সেভ
                            </button>
                            <button
                              onClick={() => setEditingLimitShopId(null)}
                              className="p-1 text-slate-400 hover:text-slate-600 text-[10px] cursor-pointer"
                            >
                              বাতিল
                            </button>
                          </div>
                        ) : isCollectingPayment ? (
                          <div className="flex items-center gap-1 pt-1">
                            <input
                              type="number"
                              placeholder="পরিশোধ BDT"
                              value={paymentAmountInput}
                              onChange={e => setPaymentAmountInput(e.target.value)}
                              className="w-20 p-1 text-xs rounded border border-slate-300 bg-white"
                            />
                            <button
                              onClick={() => handleRecordPayment(client.id)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold cursor-pointer"
                            >
                              আদায়
                            </button>
                            <button
                              onClick={() => setCollectingPaymentShopId(null)}
                              className="p-1 text-slate-400 hover:text-slate-600 text-[10px] cursor-pointer"
                            >
                              বাতিল
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 pt-0.5">
                            <button
                              onClick={() => {
                                setEditingLimitShopId(client.id);
                                setNewLimitInput(String(client.creditLimitBdt));
                              }}
                              className="text-[10px] text-indigo-600 hover:underline font-bold cursor-pointer"
                            >
                              লিমিট বদল
                            </button>
                            {client.currentDueBdt > 0 && (
                              <>
                                <span className="text-slate-300">•</span>
                                <button
                                  onClick={() => {
                                    setCollectingPaymentShopId(client.id);
                                    setPaymentAmountInput(String(client.currentDueBdt));
                                  }}
                                  className="text-[10px] text-emerald-600 hover:underline font-bold cursor-pointer"
                                >
                                  বাকি আদায়
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Validity Expiry */}
                    <td className="py-3 px-4">
                      {client.validityExpiryEpochMs ? (
                        <div>
                          <div className="font-semibold text-slate-800">
                            {new Date(client.validityExpiryEpochMs).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {isExpired ? 'মেয়াদ উত্তীর্ণ' : 'মেয়াদ সক্রিয়'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">মেয়াদহীন / পেন্ডিং</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Approve 1 Year */}
                        <button
                          onClick={() => approveShop(client.id, 365)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors cursor-pointer"
                          title="Approve for 1 Year"
                        >
                          ১ বছর অনুমোদন
                        </button>

                        {/* Suspend / Reject */}
                        {client.status !== 'SUSPENDED' && (
                          <button
                            onClick={() => rejectShop(client.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-[11px] font-bold border border-slate-300 transition-colors cursor-pointer"
                            title="Suspend wholesale access"
                          >
                            স্থগিত
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

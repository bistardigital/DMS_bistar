import React, { useState } from 'react';
import { useDms } from '../context/DmsContext.tsx';
import { canAccessB2BPricing, calculateMargin, formatCurrency, getEffectiveTierPrice } from '../utils/pricing.ts';
import { ShoppingCart, Check, Lock, Search, FileSpreadsheet, ArrowRight, Zap } from 'lucide-react';

interface QuickOrderSheetProps {
  openRegistrationModal: () => void;
  openCartDrawer: () => void;
}

export const QuickOrderSheet: React.FC<QuickOrderSheetProps> = ({
  openRegistrationModal,
  openCartDrawer
}) => {
  const { products, brands, currentUser, addToCart, currency } = useDms();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const access = canAccessB2BPricing(currentUser);
  const isApproved = access.allowed;

  const handleQtyChange = (productId: string, val: string) => {
    const num = parseInt(val) || 0;
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, num)
    }));
  };

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.skuCode && p.skuCode.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.genericName && p.genericName.toLowerCase().includes(q))
    );
  });

  const selectedEntries = Object.entries(quantities).filter(([_, qty]) => qty > 0);
  const totalItemsCount = selectedEntries.reduce((sum, [_, qty]) => sum + qty, 0);

  // Compute estimated total for entered items taking tiered pricing into account
  const totalB2B = selectedEntries.reduce((sum, [id, qty]) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return sum;
    const tierResult = getEffectiveTierPrice(prod, qty, isApproved);
    return sum + tierResult.unitPrice * qty;
  }, 0);

  const handleAddAllToCart = () => {
    if (!isApproved) {
      openRegistrationModal();
      return;
    }
    selectedEntries.forEach(([id, qty]) => {
      const prod = products.find(p => p.id === id);
      if (prod && qty > 0) {
        addToCart(prod, qty);
      }
    });

    setQuantities({});
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      openCartDrawer();
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold">একসাথে বাল্ক অর্ডার শিট (Fast Bulk Order Matrix)</h2>
            <span className="bg-indigo-500/30 text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded border border-indigo-400/30">
              High-Speed Restock
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            একসাথে একাধিক আইটেমের পরিমাণ ইনপুট দিন এবং স্বয়ংক্রিয় ৩-স্তরীয় পাইকারি মূল্যে কার্টে পাঠান।
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="পণ্য বা SKU অনুসন্ধান..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      {/* Floating Summary Bar if items selected */}
      {totalItemsCount > 0 && (
        <div className="bg-indigo-50 border-b border-indigo-200 p-3 sm:px-6 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-indigo-950 font-bold">{selectedEntries.length} টি পণ্য নির্বাচিত</span>
              <span className="text-indigo-600 ml-1">({totalItemsCount} কার্টুন/প্যাক)</span>
            </div>
            {isApproved && (
              <div className="text-emerald-800 font-extrabold hidden sm:block">
                মোট পাইকারি মূল্য: {formatCurrency(totalB2B, currency)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddAllToCart}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4" /> কার্টে যোগ হয়েছে!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                সবগুলো {totalItemsCount} প্যাক কার্টে নিন
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">আইটেম ও বিবরণ</th>
              <th className="py-3 px-4">প্যাক সাইজ</th>
              <th className="py-3 px-4 text-right">MRP (৳)</th>
              <th className="py-3 px-4 text-right">১-৯ কার্টুন (Tier 1)</th>
              <th className="py-3 px-4 text-right">১০-২৯ কার্টুন (Tier 2)</th>
              <th className="py-3 px-4 text-right">৩০+ কার্টুন (Tier 3)</th>
              <th className="py-3 px-4 text-center">স্টক</th>
              <th className="py-3 px-4 text-center w-36">অর্ডার পরিমাণ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(product => {
              const brand = brands.find(b => b.id === product.brandId);
              const currentVal = quantities[product.id] || '';
              const numVal = parseInt(String(currentVal)) || 0;
              const effectiveTier = getEffectiveTierPrice(product, numVal, isApproved);
              const mrp = product.mrpBdt || product.mrpPrice || 0;
              const tier1 = product.baseWholesaleBdt || product.b2bPrice || mrp;
              const tier2 = product.tier2PriceBdt || Math.round(tier1 * 0.96);
              const tier3 = product.tier3PriceBdt || Math.round(tier1 * 0.92);
              const stock = product.stockQty ?? product.stock ?? 100;

              return (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{product.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {product.skuCode || product.sku} {product.genericName ? `• ${product.genericName}` : ''}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-slate-100 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                      {product.packSize || product.packUnit}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-400 line-through">
                    {formatCurrency(mrp, currency)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {isApproved ? (
                      <span className={`font-semibold ${numVal > 0 && effectiveTier.tier === 1 ? 'text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded' : 'text-slate-700'}`}>
                        {formatCurrency(tier1, currency)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-700 font-bold">লক</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {isApproved ? (
                      <span className={`font-semibold ${numVal >= (product.tier2MinQty || 10) && effectiveTier.tier === 2 ? 'text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded' : 'text-slate-700'}`}>
                        {formatCurrency(tier2, currency)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-700 font-bold">লক</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {isApproved ? (
                      <span className={`font-semibold ${numVal >= (product.tier3MinQty || 30) && effectiveTier.tier === 3 ? 'text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded' : 'text-slate-700'}`}>
                        {formatCurrency(tier3, currency)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-700 font-bold">লক</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-semibold text-xs ${
                        stock > 50 ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {stock}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {isApproved ? (
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max={stock}
                          placeholder="0"
                          value={currentVal}
                          onChange={e => handleQtyChange(product.id, e.target.value)}
                          className="w-20 text-center py-1 px-2 rounded-lg border border-slate-300 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={openRegistrationModal}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                      >
                        অনুমোদন প্রয়োজন
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

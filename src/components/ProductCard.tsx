import React, { useState } from 'react';
import { B2BProduct } from '../types/index.ts';
import { useDms } from '../context/DmsContext.tsx';
import { canAccessB2BPricing, calculateMargin, formatCurrency, getEffectiveTierPrice } from '../utils/pricing.ts';
import { Lock, ShoppingCart, Check, Package, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: B2BProduct;
  openRegistrationModal: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  openRegistrationModal
}) => {
  const { currentUser, addToCart, currency, brands } = useDms();
  const [qty, setQty] = useState(product.minOrderQty || 1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imgError, setImgError] = useState(false);

  const brand = brands.find(b => b.id === product.brandId);
  const access = canAccessB2BPricing(currentUser);
  const isApproved = access.allowed;

  const mrp = product.mrpBdt || product.mrpPrice || 0;
  const tierResult = getEffectiveTierPrice(product, qty, isApproved);
  const activePrice = tierResult.unitPrice;
  const margin = calculateMargin(mrp, activePrice);

  const handleAdd = () => {
    if (!isApproved) {
      openRegistrationModal();
      return;
    }
    addToCart(product, qty);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleStepQty = (delta: number) => {
    setQty(prev => Math.max(product.minOrderQty || 1, prev + delta));
  };

  const tier1Price = product.baseWholesaleBdt || product.b2bPrice || mrp;
  const tier2Min = product.tier2MinQty || 10;
  const tier2Price = product.tier2PriceBdt || Math.round(tier1Price * 0.96);
  const tier3Min = product.tier3MinQty || 30;
  const tier3Price = product.tier3PriceBdt || Math.round(tier1Price * 0.92);

  const availableStock = product.stockQty ?? product.stock ?? 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group relative">
      {/* Top Image & Badges */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-indigo-50/40 overflow-hidden">
        {product.imageUrl && !imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-indigo-300 bg-indigo-50/50">
            <Package className="w-12 h-12 stroke-[1.5] text-indigo-400" />
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-1">
              {brand?.name || 'B2B Wholesale'}
            </span>
          </div>
        )}

        {/* Brand Tag */}
        {brand && (
          <div className="absolute top-2.5 left-2.5 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            {brand.name}
          </div>
        )}

        {/* Sector Tag */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
              product.sector === 'PHARMA'
                ? 'bg-sky-100 text-sky-800 border border-sky-200'
                : product.sector === 'AGRO'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            {product.sector}
          </span>
        </div>

        {/* Pack Unit / Size Badge */}
        <div className="absolute bottom-2.5 left-2.5 bg-indigo-600/95 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1.5">
          <Package className="w-3 h-3" />
          <span>{product.packSize || product.packUnit}</span>
        </div>

        {/* Stock Badge */}
        <div
          className={`absolute bottom-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs ${
            availableStock > 50
              ? 'bg-emerald-900/80 text-emerald-100'
              : availableStock > 10
              ? 'bg-amber-900/80 text-amber-100'
              : 'bg-rose-900/80 text-rose-100'
          }`}
        >
          {availableStock > 0 ? `স্টক: ${availableStock} প্যাক` : 'স্টক শেষ'}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
            <span>SKU: {product.skuCode || product.sku}</span>
            {product.minOrderQty > 1 && (
              <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-sans font-bold text-[10px] border border-amber-200">
                MOQ: {product.minOrderQty}
              </span>
            )}
          </div>

          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          {product.genericName && (
            <p className="text-xs text-slate-500 mt-0.5 italic line-clamp-1">
              {product.genericName}
            </p>
          )}

          {/* Pricing Grid */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-100">
            <div className="flex items-baseline justify-between mb-1.5 text-xs">
              <span className="text-slate-500 font-medium">খুচরা মূল্য (Retail MRP):</span>
              <span className="font-semibold text-slate-500 line-through">
                {formatCurrency(mrp, currency)}
              </span>
            </div>

            {/* B2B Wholesale Tier Slabs or Locked Gate */}
            {isApproved ? (
              <div className="space-y-2">
                {/* 3-Tier Wholesale Slab Matrix */}
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider">
                    <span>বাল্ক স্ল্যাব (Bulk Slab)</span>
                    <span>পাইকারি দর (৳ BDT)</span>
                  </div>

                  {/* Tier 1 */}
                  <div
                    className={`flex items-center justify-between px-2 py-1 rounded-lg text-xs transition-colors ${
                      tierResult.tier === 1
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <span>১ – {tier2Min - 1} কার্টুন (বেসিক)</span>
                    <span>{formatCurrency(tier1Price, currency)}</span>
                  </div>

                  {/* Tier 2 */}
                  <div
                    className={`flex items-center justify-between px-2 py-1 rounded-lg text-xs transition-colors ${
                      tierResult.tier === 2
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <span>{tier2Min} – {tier3Min - 1} কার্টুন (ডিলার)</span>
                    <div className="flex items-center gap-1.5">
                      <span>{formatCurrency(tier2Price, currency)}</span>
                      {tierResult.tier !== 2 && (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1 rounded">
                          -৳{tier1Price - tier2Price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tier 3 */}
                  <div
                    className={`flex items-center justify-between px-2 py-1 rounded-lg text-xs transition-colors ${
                      tierResult.tier === 3
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <span>{tier3Min}+ কার্টুন (সুপার ডিপ)</span>
                    <div className="flex items-center gap-1.5">
                      <span>{formatCurrency(tier3Price, currency)}</span>
                      {tierResult.tier !== 3 && (
                        <span className="text-[10px] text-indigo-700 font-bold bg-indigo-100 px-1 rounded">
                          -৳{tier1Price - tier3Price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Live Margin Calculation */}
                <div className="bg-emerald-50 rounded-lg px-2.5 py-1.5 border border-emerald-200 text-xs flex items-center justify-between text-emerald-800">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>দোকানদারের মুনাফা:</span>
                  </div>
                  <span className="font-extrabold">
                    +{margin.marginPercent}% ({formatCurrency(margin.profitAmount, currency)}/প্যাক)
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold">
                  <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>পাইকারি মূল্য লক করা (Wholesale Locked)</span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1 leading-snug">
                  {currentUser?.status === 'PENDING'
                    ? 'আপনার দোকান ভেরিফিকেশন প্রক্রিয়াধীন। অনুমোদনের পর BDT রেট আনলক হবে।'
                    : 'শুধুমাত্র অনুমোদিত বিটুবি গ্রাহক ও ডিলারদের জন্য ৩-স্তর বিশিষ্ট পাইকারি মূল্য উন্মুক্ত।'}
                </p>
                <button
                  onClick={openRegistrationModal}
                  className="mt-2 text-xs font-bold text-amber-900 hover:text-black underline flex items-center gap-1"
                >
                  {currentUser?.status === 'PENDING' ? 'আবেদনের স্ট্যাটাস দেখুন' : 'দোকান নিবন্ধন আবেদন করুন →'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Bottom Row with Step Buttons */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          {isApproved ? (
            <>
              {/* Stepper + Quick Step (+1, +5, +10) */}
              <div className="flex items-center justify-between gap-1.5">
                {/* Stepper */}
                <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 overflow-hidden shadow-2xs">
                  <button
                    onClick={() => handleStepQty(-1)}
                    className="w-7 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-200 text-xs font-extrabold transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={product.minOrderQty || 1}
                    value={qty}
                    onChange={e => setQty(Math.max(product.minOrderQty || 1, parseInt(e.target.value) || 1))}
                    className="w-10 h-8 text-center text-xs font-extrabold bg-transparent text-slate-900 focus:outline-none"
                    aria-label="Order Quantity"
                  />
                  <button
                    onClick={() => handleStepQty(1)}
                    className="w-7 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-200 text-xs font-extrabold transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Quick Step Buttons for rapid wholesale ordering */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStepQty(5)}
                    className="px-2 py-1.5 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-300 transition-colors cursor-pointer"
                    title="Add 5 Cartons"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => handleStepQty(10)}
                    className="px-2 py-1.5 text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md border border-indigo-200 transition-colors cursor-pointer"
                    title="Add 10 Cartons (Tier 2)"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => handleStepQty(30)}
                    className="px-2 py-1.5 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200 transition-colors cursor-pointer"
                    title="Add 30 Cartons (Tier 3 Deep)"
                  >
                    +30
                  </button>
                </div>
              </div>

              {/* Subtotal & Add Button */}
              <div className="flex items-center justify-between gap-2">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block leading-tight">মোট প্রদেয়:</span>
                  <span className="text-xs font-extrabold text-slate-900">
                    {formatCurrency(activePrice * qty, currency)}
                  </span>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={availableStock <= 0}
                  className={`flex-1 h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : availableStock <= 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 shadow-indigo-600/20'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> যুক্ত হয়েছে!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" /> কার্টে যোগ করুন
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={openRegistrationModal}
              className="w-full h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-300 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              অর্ডার করতে অনুমোদন প্রয়োজন
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

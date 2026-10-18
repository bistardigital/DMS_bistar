import React, { useState } from 'react';
import { Product } from '../types/index.ts';
import { useDms } from '../context/DmsContext.tsx';
import { canAccessB2BPricing, calculateMargin, formatCurrency } from '../utils/pricing.ts';
import { Lock, ShoppingCart, Check, Package, TrendingUp, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
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
  const margin = calculateMargin(product.mrpPrice, product.b2bPrice);

  const handleAdd = () => {
    if (!isApproved) {
      openRegistrationModal();
      return;
    }
    addToCart(product, qty);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
      {/* Top Image & Badges */}
      <div className="relative h-44 bg-gradient-to-br from-slate-100 to-indigo-50/40 overflow-hidden">
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
              {brand?.name || 'Wholesale Depot'}
            </span>
          </div>
        )}

        {/* Brand Tag */}
        {brand && (
          <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
            {brand.name}
          </div>
        )}

        {/* Pack Unit Badge */}
        <div className="absolute bottom-2.5 left-2.5 bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
          <Package className="w-3 h-3" />
          {product.packUnit}
        </div>

        {/* Stock Badge */}
        <div
          className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs ${
            product.stock > 100
              ? 'bg-emerald-100 text-emerald-800'
              : product.stock > 20
              ? 'bg-amber-100 text-amber-800'
              : 'bg-rose-100 text-rose-800'
          }`}
        >
          {product.stock > 0 ? `Stock: ${product.stock} packs` : 'Out of Stock'}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
            <span>SKU: {product.sku}</span>
            {product.minOrderQty > 1 && (
              <span className="text-amber-600 font-sans font-medium">MOQ: {product.minOrderQty}</span>
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
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-baseline justify-between mb-1 text-xs">
              <span className="text-slate-400">Retail MRP:</span>
              <span className="font-semibold text-slate-600 line-through">
                {formatCurrency(product.mrpPrice, currency)}
              </span>
            </div>

            {/* B2B Wholesale Price or Locked Gate */}
            {isApproved ? (
              <div className="bg-emerald-50/70 rounded-lg p-2.5 border border-emerald-100">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    B2B Wholesale:
                  </span>
                  <span className="text-base font-extrabold text-emerald-700">
                    {formatCurrency(product.b2bPrice, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-emerald-200/60 text-[11px] text-emerald-800">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    Retailer Margin:
                  </span>
                  <span className="font-bold">
                    +{margin.marginPercent}% ({formatCurrency(margin.profitAmount, currency)} profit)
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/90 rounded-lg p-2.5 border border-amber-200/80">
                <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
                  <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Wholesale Price Locked</span>
                </div>
                <p className="text-[10px] text-amber-700 mt-1 leading-tight font-medium">
                  {currentUser?.status === 'PENDING'
                    ? 'Your B2B account is pending dealer verification.'
                    : 'Registered & Approved B2B clients only.'}
                </p>
                <button
                  onClick={openRegistrationModal}
                  className="mt-1.5 text-[11px] font-bold text-amber-800 hover:text-amber-900 underline flex items-center gap-1"
                >
                  {currentUser?.status === 'PENDING' ? 'Check Status' : 'Request B2B Approval →'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Bottom Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          {isApproved ? (
            <>
              {/* Pack Multiplier Stepper */}
              <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden shrink-0">
                <button
                  onClick={() => setQty(Math.max(product.minOrderQty, qty - 1))}
                  className="w-7 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  min={product.minOrderQty}
                  value={qty}
                  onChange={e => setQty(Math.max(product.minOrderQty, parseInt(e.target.value) || product.minOrderQty))}
                  className="w-9 h-8 text-center text-xs font-bold bg-transparent text-slate-800 focus:outline-none"
                  aria-label="Quantity"
                />
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-7 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAdd}
                disabled={product.stock <= 0}
                className={`flex-1 h-8 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : product.stock <= 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" /> Add Packs
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={openRegistrationModal}
              className="w-full h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Approval Required to Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

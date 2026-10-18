import React, { useState } from 'react';
import { useDms } from '../context/DmsContext.tsx';
import { canAccessB2BPricing, calculateMargin, formatCurrency } from '../utils/pricing.ts';
import { ShoppingCart, Check, Lock, Search, FileSpreadsheet, ArrowRight } from 'lucide-react';

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
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.genericName && p.genericName.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  const selectedEntries = Object.entries(quantities).filter(([_, qty]) => qty > 0);
  const totalItemsCount = selectedEntries.reduce((sum, [_, qty]) => sum + qty, 0);

  // Compute estimated total for entered items
  const totalB2B = selectedEntries.reduce((sum, [id, qty]) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return sum;
    return sum + (isApproved ? prod.b2bPrice : prod.mrpPrice) * qty;
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold">Fast Bulk Order Sheet</h2>
            <span className="bg-indigo-500/30 text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded border border-indigo-400/30">
              High-Speed Restock
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Input order quantities across multiple SKUs and push them straight into your wholesale cart.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Quick SKU or name search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      {/* Floating Summary Bar if items selected */}
      {totalItemsCount > 0 && (
        <div className="bg-indigo-50 border-b border-indigo-200 p-3 sm:px-6 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-indigo-900 font-bold">{selectedEntries.length} Products</span>
              <span className="text-indigo-600 ml-1">({totalItemsCount} total packs)</span>
            </div>
            {isApproved && (
              <div className="text-emerald-800 font-bold hidden sm:block">
                Wholesale Total: {formatCurrency(totalB2B, currency)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddAllToCart}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4" /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add All {totalItemsCount} Packs to Cart
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[11px] tracking-wider">
            <tr>
              <th className="py-3 px-4">SKU / Item</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Pack Unit</th>
              <th className="py-3 px-4 text-right">MRP</th>
              <th className="py-3 px-4 text-right">Wholesale Price</th>
              <th className="py-3 px-4 text-center">Available Stock</th>
              <th className="py-3 px-4 text-center w-36">Order Packs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(product => {
              const brand = brands.find(b => b.id === product.brandId);
              const margin = calculateMargin(product.mrpPrice, product.b2bPrice);
              const currentVal = quantities[product.id] || '';

              return (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{product.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {product.sku} {product.genericName ? `• ${product.genericName}` : ''}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {brand?.name || 'Standard'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-slate-100 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded">
                      {product.packUnit}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-400 line-through">
                    {formatCurrency(product.mrpPrice, currency)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {isApproved ? (
                      <div>
                        <div className="font-bold text-emerald-700 text-sm">
                          {formatCurrency(product.b2bPrice, currency)}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          +{margin.marginPercent}% margin
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-semibold text-xs ${
                        product.stock > 100 ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {isApproved ? (
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max={product.stock}
                          placeholder={`MOQ: ${product.minOrderQty}`}
                          value={currentVal}
                          onChange={e => handleQtyChange(product.id, e.target.value)}
                          className="w-24 text-center py-1.5 px-2 rounded-lg border border-slate-300 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={openRegistrationModal}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold underline"
                      >
                        Approval Req.
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

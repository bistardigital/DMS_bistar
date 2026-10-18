import React from 'react';
import { useDms } from '../context/DmsContext.tsx';
import { Search, Filter, Calendar, MapPin, AlertCircle } from 'lucide-react';

interface ProductFiltersProps {
  search: string;
  setSearch: (s: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedBrand: string;
  setSelectedBrand: (b: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  inStockOnly,
  setInStockOnly
}) => {
  const { categories, brands, currentUser, routes } = useDms();

  const userRoute = currentUser?.routeId
    ? routes.find(r => r.id === currentUser.routeId)
    : routes[0];

  return (
    <div className="space-y-4">
      {/* Route & Delivery Schedule Notification Card */}
      {userRoute && (
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0 text-indigo-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Assigned Delivery Route:
                </span>
                <span className="bg-indigo-600/50 text-[11px] px-2 py-0.5 rounded-full font-semibold border border-indigo-400/30">
                  {userRoute.routeName}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1 text-amber-300 font-medium">
                  <Calendar className="w-3.5 h-3.5" /> Order Cutoff: {userRoute.orderCutoffDay}
                </span>
                <span className="text-emerald-300 font-semibold">
                  🚚 Delivery: {userRoute.deliveryDay}
                </span>
              </div>
            </div>
          </div>

          {!currentUser && (
            <div className="text-right shrink-0">
              <span className="text-[11px] bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                Select route when registering your store
              </span>
            </div>
          )}
        </div>
      )}

      {/* Search & Select Bars */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="relative md:col-span-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Product Name, Generic, or SKU code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
            />
          </div>

          {/* Brand select */}
          <div className="md:col-span-3">
            <select
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 text-slate-700 font-medium"
            >
              <option value="ALL">All Brands & Principals</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* In Stock Toggle */}
          <div className="md:col-span-3 flex items-center justify-between sm:justify-end gap-3 px-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              In-Stock Only
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

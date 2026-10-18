import React, { useState } from 'react';
import { useDms } from '../../context/DmsContext.tsx';
import { Product, DeliveryRoute } from '../../types/index.ts';
import { formatCurrency, calculateMargin } from '../../utils/pricing.ts';
import { Plus, Edit2, Trash2, Package, MapPin, Check, X, TrendingUp } from 'lucide-react';

export const ProductManagementModal: React.FC = () => {
  const {
    products,
    brands,
    categories,
    routes,
    addProduct,
    updateProduct,
    deleteProduct,
    addRoute,
    deleteRoute,
    currency
  } = useDms();

  const [activeTab, setActiveTab] = useState<'products' | 'routes'>('products');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdBrand, setNewProdBrand] = useState(brands[0]?.id || '');
  const [newProdCategory, setNewProdCategory] = useState(categories[0]?.id || '');
  const [newProdPackUnit, setNewProdPackUnit] = useState('Box of 100');
  const [newProdGeneric, setNewProdGeneric] = useState('');
  const [newProdMrp, setNewProdMrp] = useState('200');
  const [newProdB2b, setNewProdB2b] = useState('160');
  const [newProdStock, setNewProdStock] = useState('250');
  const [newProdMoq, setNewProdMoq] = useState('2');
  const [newProdImage, setNewProdImage] = useState('');

  // Route Form State
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteCutoff, setNewRouteCutoff] = useState('Monday 05:00 PM');
  const [newRouteDelivery, setNewRouteDelivery] = useState('Tuesday (Weekly)');
  const [newRouteAreaCode, setNewRouteAreaCode] = useState('RTE-104');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProdName,
      sku: newProdSku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      brandId: newProdBrand,
      categoryId: newProdCategory,
      packUnit: newProdPackUnit,
      genericName: newProdGeneric || undefined,
      mrpPrice: parseFloat(newProdMrp) || 0,
      b2bPrice: parseFloat(newProdB2b) || 0,
      stock: parseInt(newProdStock) || 100,
      minOrderQty: parseInt(newProdMoq) || 1,
      imageUrl: newProdImage || undefined
    });
    setShowAddProductModal(false);
    resetProductForm();
  };

  const resetProductForm = () => {
    setNewProdName('');
    setNewProdSku('');
    setNewProdGeneric('');
    setNewProdMrp('200');
    setNewProdB2b('160');
    setNewProdStock('250');
    setNewProdMoq('2');
    setNewProdImage('');
  };

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteName.trim()) return;
    addRoute({
      routeName: newRouteName,
      orderCutoffDay: newRouteCutoff,
      deliveryDay: newRouteDelivery,
      areaCode: newRouteAreaCode
    });
    setShowAddRouteModal(false);
    setNewRouteName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'products'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Dual-Priced Catalog ({products.length} SKUs)
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'routes'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Delivery Routes & Schedules ({routes.length} Routes)
          </button>
        </div>

        {activeTab === 'products' ? (
          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Product SKU
          </button>
        ) : (
          <button
            onClick={() => setShowAddRouteModal(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Delivery Route
          </button>
        )}
      </div>

      {/* Product Management Table */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">SKU / Item</th>
                  <th className="py-3 px-4">Brand & Category</th>
                  <th className="py-3 px-4">Pack Unit</th>
                  <th className="py-3 px-4 text-right">Retail MRP</th>
                  <th className="py-3 px-4 text-right">Wholesale B2B Rate</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(prod => {
                  const brand = brands.find(b => b.id === prod.brandId);
                  const cat = categories.find(c => c.id === prod.categoryId);
                  const margin = calculateMargin(prod.mrpPrice, prod.b2bPrice);

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{prod.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {prod.sku} {prod.genericName ? `• ${prod.genericName}` : ''}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{brand?.name}</div>
                        <div className="text-[10px] text-slate-400">{cat?.name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded">
                          {prod.packUnit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-500">
                        {formatCurrency(prod.mrpPrice, currency)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="font-bold text-emerald-700 text-sm">
                          {formatCurrency(prod.b2bPrice, currency)}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium">
                          +{margin.marginPercent}% margin
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-700">
                        {prod.stock}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                            title="Edit Prices & Stock"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete product ${prod.name}?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete SKU"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Routes Management */}
      {activeTab === 'routes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map(route => (
            <div
              key={route.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{route.routeName}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Code: {route.areaCode || 'N/A'}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete route ${route.routeName}?`)) {
                      deleteRoute(route.id);
                    }
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Order Cutoff</span>
                  <span className="font-semibold text-amber-700">{route.orderCutoffDay}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Delivery Schedule</span>
                  <span className="font-semibold text-emerald-700">{route.deliveryDay}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Product SKU</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol Extra 500mg"
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    placeholder="e.g. MED-099"
                    value={newProdSku}
                    onChange={e => setNewProdSku(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pack Unit *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50s Pot, Box of 100"
                    value={newProdPackUnit}
                    onChange={e => setNewProdPackUnit(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand / Principal</label>
                  <select
                    value={newProdBrand}
                    onChange={e => setNewProdBrand(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Generic Name / Specs</label>
                <input
                  type="text"
                  placeholder="e.g. Paracetamol BP + Caffeine 65mg"
                  value={newProdGeneric}
                  onChange={e => setNewProdGeneric(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Dual Pricing */}
              <div className="grid grid-cols-2 gap-3 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Consumer Retail MRP ({currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdMrp}
                    onChange={e => setNewProdMrp(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-emerald-800 block mb-1">B2B Wholesale Price ({currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdB2b}
                    onChange={e => setNewProdB2b(e.target.value)}
                    className="w-full p-2 rounded-lg border border-emerald-300 bg-white font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Warehouse Stock (Packs)</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={e => setNewProdStock(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Minimum Order Qty (MOQ)</label>
                  <input
                    type="number"
                    value={newProdMoq}
                    onChange={e => setNewProdMoq(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs mt-3 shadow-md"
              >
                Create Product SKU
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dual Prices Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Quick Price & Stock Update</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="font-bold text-slate-900 text-sm">{editingProduct.name}</div>
              <div className="text-[10px] text-slate-500 font-mono">
                {editingProduct.sku} • {editingProduct.packUnit}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Consumer Retail MRP ({currency})</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.mrpPrice}
                  onChange={e => setEditingProduct({ ...editingProduct, mrpPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-emerald-800 block mb-1">Wholesale B2B Price ({currency})</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.b2bPrice}
                  onChange={e => setEditingProduct({ ...editingProduct, b2bPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg border border-emerald-300 bg-white font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Available Stock (Packs)</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold"
                />
              </div>

              <button
                onClick={() => {
                  updateProduct(editingProduct.id, {
                    mrpPrice: editingProduct.mrpPrice,
                    b2bPrice: editingProduct.b2bPrice,
                    stock: editingProduct.stock
                  });
                  setEditingProduct(null);
                }}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md mt-2"
              >
                Save Price & Stock Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Route Modal */}
      {showAddRouteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Delivery Route Schedule</h3>
              <button onClick={() => setShowAddRouteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateRoute} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Route / Market Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shibchar Sadar, Zajira 1"
                  value={newRouteName}
                  onChange={e => setNewRouteName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Order Cutoff Day & Time</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monday 06:00 PM"
                  value={newRouteCutoff}
                  onChange={e => setNewRouteCutoff(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Scheduled Delivery Day</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tuesday (Weekly)"
                  value={newRouteDelivery}
                  onChange={e => setNewRouteDelivery(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Area / Route Code</label>
                <input
                  type="text"
                  placeholder="e.g. RTE-104"
                  value={newRouteAreaCode}
                  onChange={e => setNewRouteAreaCode(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs mt-3 shadow-md"
              >
                Create Delivery Route
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { DmsProvider, useDms } from './context/DmsContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { ProductFilters } from './components/ProductFilters.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { QuickOrderSheet } from './components/QuickOrderSheet.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { ClientRegistrationModal } from './components/ClientRegistrationModal.tsx';
import { ClientOrdersView } from './components/ClientOrdersView.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { PwaInstallPrompt } from './components/PwaInstallPrompt.tsx';
import {
  Boxes,
  FileSpreadsheet,
  PackageCheck,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { canAccessB2BPricing } from './utils/pricing.ts';

function MainLayout() {
  const {
    products,
    currentUser,
    cart,
    unseenOrdersCount
  } = useDms();

  const [currentTab, setCurrentTab] = useState<'catalog' | 'matrix' | 'orders' | 'admin'>('catalog');
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Catalog filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [inStockOnly, setInStockOnly] = useState(false);

  const access = canAccessB2BPricing(currentUser);
  const isApproved = access.allowed;

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filter products
  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'ALL' && product.categoryId !== selectedCategory) {
      return false;
    }
    if (selectedBrand !== 'ALL' && product.brandId !== selectedBrand) {
      return false;
    }
    if (inStockOnly && product.stock <= 0) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchSku = product.sku.toLowerCase().includes(q);
      const matchGeneric = product.genericName && product.genericName.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchGeneric) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-20 md:pb-8">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openRegistrationModal={() => setIsRegistrationOpen(true)}
        openCartDrawer={() => setIsCartOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Guest / Pending Warning Banner if prices are locked */}
        {!isApproved && currentTab === 'catalog' && (
          <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {currentUser?.status === 'PENDING'
                    ? 'Account Verification In Progress (Status: PENDING)'
                    : 'B2B Wholesale Portal - Client Approval Required'}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  {currentUser?.status === 'PENDING'
                    ? 'Your shop registration is under distributor review. You can browse product names and MRPs, but wholesale tiered pricing is locked.'
                    : 'Wholesale prices and bulk order checkout are reserved for verified retailers, pharmacies, and dealers.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsRegistrationOpen(true)}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs shrink-0 transition-colors"
            >
              <span>{currentUser?.status === 'PENDING' ? 'Check Status' : 'Apply for Wholesale Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* View 1: Wholesale Catalog */}
        {currentTab === 'catalog' && (
          <div className="space-y-6">
            <ProductFilters
              search={search}
              setSearch={setSearch}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
            />

            {/* Results count & Quick Switch */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing <strong className="text-slate-900">{filteredProducts.length}</strong> wholesale SKUs
              </div>
              <button
                onClick={() => setCurrentTab('matrix')}
                className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Switch to Quick Bulk Order Matrix →
              </button>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <Boxes className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-sm">No Products Found</h3>
                <p className="text-xs text-slate-400 mt-1">Try relaxing your search terms or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    openRegistrationModal={() => setIsRegistrationOpen(true)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 2: Quick Bulk Order Sheet */}
        {currentTab === 'matrix' && (
          <QuickOrderSheet
            openRegistrationModal={() => setIsRegistrationOpen(true)}
            openCartDrawer={() => setIsCartOpen(true)}
          />
        )}

        {/* View 3: Client Orders & Tracking */}
        {currentTab === 'orders' && <ClientOrdersView />}

        {/* View 4: Admin Hub */}
        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900 border-t border-slate-800 z-30 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setCurrentTab('catalog')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-bold ${
            currentTab === 'catalog' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Boxes className="w-5 h-5 mb-0.5" />
          <span>Catalog</span>
        </button>

        <button
          onClick={() => setCurrentTab('matrix')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-bold ${
            currentTab === 'matrix' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <FileSpreadsheet className="w-5 h-5 mb-0.5" />
          <span>Matrix</span>
        </button>

        <button
          onClick={() => setCurrentTab('orders')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-bold ${
            currentTab === 'orders' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <PackageCheck className="w-5 h-5 mb-0.5" />
          <span>Orders</span>
        </button>

        <button
          onClick={() => setCurrentTab('admin')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-bold relative ${
            currentTab === 'admin' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <ShieldAlert className="w-5 h-5 mb-0.5" />
          <span>Admin</span>
          {unseenOrdersCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-bold text-slate-400 relative"
        >
          <ShoppingCart className="w-5 h-5 mb-0.5" />
          <span>Cart</span>
          {totalCartCount > 0 && (
            <span className="absolute top-0.5 right-2 bg-indigo-500 text-white font-extrabold text-[9px] px-1 rounded-full">
              {totalCartCount}
            </span>
          )}
        </button>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        openRegistrationModal={() => {
          setIsCartOpen(false);
          setIsRegistrationOpen(true);
        }}
        goToOrders={() => setCurrentTab('orders')}
      />

      {/* Registration Modal */}
      <ClientRegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />

      {/* PWA Install Banner */}
      <PwaInstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <DmsProvider>
      <MainLayout />
    </DmsProvider>
  );
}

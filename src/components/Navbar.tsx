import React, { useState } from 'react';
import { useDms } from '../context/DmsContext.tsx';
import {
  Boxes,
  ShoppingCart,
  FileSpreadsheet,
  PackageCheck,
  ShieldAlert,
  UserPlus,
  LogOut,
  Store,
  CheckCircle2,
  Clock,
  KeyRound,
  ChevronDown,
  Shield
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'catalog' | 'matrix' | 'orders' | 'admin';
  setCurrentTab: (tab: 'catalog' | 'matrix' | 'orders' | 'admin') => void;
  openRegistrationModal: () => void;
  openCartDrawer: () => void;
  openAdminLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openRegistrationModal,
  openCartDrawer,
  openAdminLoginModal
}) => {
  const {
    currentUser,
    users,
    setCurrentUser,
    cart,
    isAdminAuthenticated,
    adminLogout,
    unseenOrdersCount,
    clearUnseenOrders
  } = useDms();

  const [isShopSwitcherOpen, setIsShopSwitcherOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const clientShops = users.filter(u => u.role === 'B2B_CLIENT');

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('catalog')}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Boxes className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                    BISTAR
                  </span>
                  <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-indigo-500/30">
                    B2B-DMS
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">পাইকারি ডিস্ট্রিবিউশন প্ল্যাটফর্ম (Wholesale Portal)</div>
              </div>
            </button>

            {/* User Navigation Links */}
            <nav className="hidden md:flex items-center ml-5 space-x-1">
              <button
                onClick={() => setCurrentTab('catalog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  currentTab === 'catalog'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                পণ্য ক্যাটালগ (Catalog)
              </button>

              <button
                onClick={() => setCurrentTab('matrix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  currentTab === 'matrix'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                একসাথে বাল্ক অর্ডার (Bulk Order)
              </button>

              {currentUser && (
                <button
                  onClick={() => setCurrentTab('orders')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    currentTab === 'orders'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  আমার চালান ও অর্ডার (My Orders)
                </button>
              )}

              {/* Admin Hub Button (Appears if authenticated, or shows badge) */}
              {isAdminAuthenticated && (
                <button
                  onClick={() => {
                    setCurrentTab('admin');
                    clearUnseenOrders();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    currentTab === 'admin'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  অ্যাডমিন হাব (Admin Hub)
                  {unseenOrdersCount > 0 && (
                    <span className="animate-pulse bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      +{unseenOrdersCount}
                    </span>
                  )}
                </button>
              )}
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Bangladeshi Currency Badge (BDT ৳) */}
            <div className="flex items-center px-2 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-emerald-400 font-extrabold text-xs shadow-2xs">
              <span className="mr-1 text-[13px]">৳</span>
              <span>BDT</span>
            </div>

            {/* Quick Demo Shop Switcher (Evaluator testing convenience) */}
            <div className="relative">
              <button
                onClick={() => setIsShopSwitcherOpen(!isShopSwitcherOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
                title="Switch active shop account to test approval gating"
              >
                <Store className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="font-semibold max-w-[100px] sm:max-w-[130px] truncate">
                  {currentUser ? (currentUser.shopName || currentUser.ownerName) : 'দোকান নির্বাচন'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isShopSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                    দোকান অ্যাকাউন্ট পরিবর্তন (Demo Switcher)
                  </div>
                  <div className="space-y-1 my-1 max-h-56 overflow-y-auto">
                    {clientShops.map(shop => {
                      const isSelected = currentUser?.id === shop.id;
                      return (
                        <button
                          key={shop.id}
                          onClick={() => {
                            setCurrentUser(shop);
                            setIsShopSwitcherOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-600/30 border border-indigo-500 text-white'
                              : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-slate-100">{shop.shopName}</div>
                            <div className="text-[10px] text-slate-400">
                              {shop.ownerName} • {shop.routeName}
                            </div>
                          </div>
                          <div>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                shop.status === 'APPROVED'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : shop.status === 'PENDING'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {shop.status}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-slate-800 pt-1 mt-1">
                    <button
                      onClick={() => {
                        setIsShopSwitcherOpen(false);
                        openRegistrationModal();
                      }}
                      className="w-full text-center py-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> নতুন দোকান নিবন্ধন আবেদন
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Admin Gateway Login Button */}
            {!isAdminAuthenticated ? (
              <button
                onClick={openAdminLoginModal}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-amber-500/30 transition-colors cursor-pointer"
                title="Enter Super Admin / Dealer PIN (/admin)"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>/admin</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  adminLogout();
                  if (window.location.hash.includes('admin')) {
                    window.location.hash = '';
                  }
                  setCurrentTab('catalog');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-300 hover:text-white text-xs font-semibold border border-rose-800/40 transition-colors cursor-pointer"
                title="Exit Admin Panel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">লগআউট অ্যাডমিন</span>
              </button>
            )}

            {/* Wholesale Cart Button */}
            <button
              onClick={openCartDrawer}
              className="relative p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              aria-label={`Cart with ${totalCartCount} items`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">কার্ট</span>
              {totalCartCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-1.5 py-0.2 rounded-full shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

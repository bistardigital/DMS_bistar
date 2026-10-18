import React from 'react';
import { useDms } from '../context/DmsContext.tsx';
import { PersonaSwitcher } from './PersonaSwitcher.tsx';
import {
  Boxes,
  ShoppingCart,
  Volume2,
  VolumeX,
  BellRing,
  FileSpreadsheet,
  PackageCheck,
  ShieldAlert,
  UserPlus,
  RefreshCw
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'catalog' | 'matrix' | 'orders' | 'admin';
  setCurrentTab: (tab: 'catalog' | 'matrix' | 'orders' | 'admin') => void;
  openRegistrationModal: () => void;
  openCartDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openRegistrationModal,
  openCartDrawer
}) => {
  const {
    currentUser,
    cart,
    currency,
    setCurrency,
    isSoundMuted,
    toggleSoundMute,
    triggerTestAlarm,
    unseenOrdersCount,
    clearUnseenOrders,
    resetDemoData
  } = useDms();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('catalog')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
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
                <div className="text-[10px] text-slate-400 font-medium">Wholesale Commerce & Distribution</div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center ml-6 space-x-1">
              <button
                onClick={() => setCurrentTab('catalog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentTab === 'catalog'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                Wholesale Catalog
              </button>

              <button
                onClick={() => setCurrentTab('matrix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentTab === 'matrix'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Quick Bulk Order
              </button>

              {currentUser && (
                <button
                  onClick={() => setCurrentTab('orders')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    currentTab === 'orders'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  My Orders
                </button>
              )}

              <button
                onClick={() => {
                  setCurrentTab('admin');
                  clearUnseenOrders();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors relative ${
                  currentTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Hub
                {unseenOrdersCount > 0 && (
                  <span className="animate-pulse bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    +{unseenOrdersCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Audio Alarm Sound Toggle & Test */}
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
              <button
                onClick={toggleSoundMute}
                className={`p-1.5 rounded-md text-xs transition-colors flex items-center gap-1 ${
                  isSoundMuted ? 'text-slate-400 hover:text-slate-200' : 'text-emerald-400 hover:text-emerald-300'
                }`}
                title={isSoundMuted ? 'Order Alarm Muted (Click to Unmute)' : 'Order Alarm Active (Click to Mute)'}
                aria-label="Toggle Order Alarm Sound"
              >
                {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={triggerTestAlarm}
                className="px-2 py-1 text-[10px] text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors flex items-center gap-1"
                title="Test Loud Order Siren"
              >
                <BellRing className="w-3 h-3 text-amber-400" />
                <span className="hidden lg:inline">Test Siren</span>
              </button>
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60 text-xs">
              <button
                onClick={() => setCurrency('$')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                  currency === '$' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                $ USD
              </button>
              <button
                onClick={() => setCurrency('৳')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                  currency === '৳' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                ৳ BDT
              </button>
            </div>

            {/* Persona Switcher Dropdown */}
            <PersonaSwitcher />

            {/* Register B2B Client button (if guest or pending) */}
            {(!currentUser || currentUser.status === 'PENDING') && (
              <button
                onClick={openRegistrationModal}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {currentUser?.status === 'PENDING' ? 'Status: Pending' : 'Apply for B2B Account'}
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={openCartDrawer}
              className="relative p-2 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white transition-colors flex items-center gap-1.5 shadow-sm"
              aria-label={`Cart with ${totalCartCount} items`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-xs font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Reset Demo State Button (for seamless evaluation) */}
            <button
              onClick={() => {
                if (window.confirm('Reset catalog, users, and orders back to initial seed data?')) {
                  resetDemoData();
                }
              }}
              title="Reset Demo Data"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

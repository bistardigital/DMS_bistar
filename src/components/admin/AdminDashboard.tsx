import React, { useState } from 'react';
import { useDms } from '../../context/DmsContext.tsx';
import { formatCurrency } from '../../utils/pricing.ts';
import { OrderManagement } from './OrderManagement.tsx';
import { RoutePickList } from './RoutePickList.tsx';
import { ClientApprovalTable } from './ClientApprovalTable.tsx';
import { ProductManagementModal } from './ProductManagementModal.tsx';
import {
  ShieldAlert,
  Package,
  FileSpreadsheet,
  Users,
  Layers,
  DollarSign,
  TrendingUp,
  Volume2,
  BellRing,
  MapPin,
  Clock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    users,
    routes,
    products,
    currency,
    triggerTestAlarm,
    unseenOrdersCount
  } = useDms();

  const [adminTab, setAdminTab] = useState<'orders' | 'picklist' | 'clients' | 'inventory'>('orders');

  const pendingClientsCount = users.filter(u => u.role === 'B2B_CLIENT' && u.status === 'PENDING').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeOrdersCount = orders.filter(
    o => o.status === 'RECEIVED' || o.status === 'PROCESSING' || o.status === 'DISPATCHED'
  ).length;

  return (
    <div className="space-y-6">
      {/* Admin Hub Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded uppercase tracking-wider">
              Dealer Operations Center
            </span>
            <span className="text-slate-400 text-xs">• BISTAR Distribution Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            Super Admin & Dispatch Command
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time distributor operations: manage wholesale catalog, dual tiered pricing, route schedules, client gating approvals, and audio order alerts.
          </p>
        </div>

        {/* Quick Alarm Test Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={triggerTestAlarm}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            title="Play warehouse order siren chime"
          >
            <BellRing className="w-4 h-4" />
            <span>Test Order Siren Alarm</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Wholesale Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {formatCurrency(totalRevenue, currency)}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> From completed & active orders
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Active Dispatch Orders</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-600 mt-2">
            {activeOrdersCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {orders.length} total historical orders
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Client Approvals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 mt-2">
            {pendingClientsCount} Pending
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {users.filter(u => u.role === 'B2B_CLIENT').length} total registered shops
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Delivery Routes</span>
            <MapPin className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-600 mt-2">
            {routes.length} Active
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {products.length} dual-priced catalog SKUs
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setAdminTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors relative ${
            adminTab === 'orders'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Live Orders & Dispatch</span>
          {unseenOrdersCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full animate-bounce">
              {unseenOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('picklist')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
            adminTab === 'picklist'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Route-Wise Pick-Lists (Warehouse Staging)</span>
        </button>

        <button
          onClick={() => setAdminTab('clients')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors relative ${
            adminTab === 'clients'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>B2B Client Approvals & Gating</span>
          {pendingClientsCount > 0 && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {pendingClientsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
            adminTab === 'inventory'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Dual Pricing & Route Schedules</span>
        </button>
      </div>

      {/* Tab Panels */}
      {adminTab === 'orders' && <OrderManagement />}
      {adminTab === 'picklist' && <RoutePickList />}
      {adminTab === 'clients' && <ClientApprovalTable />}
      {adminTab === 'inventory' && <ProductManagementModal />}
    </div>
  );
};

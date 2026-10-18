import React, { useState } from 'react';
import { useDms } from '../../context/DmsContext.tsx';
import { Order, OrderStatus } from '../../types/index.ts';
import { formatCurrency } from '../../utils/pricing.ts';
import {
  BellRing,
  Printer,
  Clock,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  Filter,
  MapPin,
  Calendar
} from 'lucide-react';
import { DeliveryInvoiceModal } from './DeliveryInvoiceModal.tsx';

export const OrderManagement: React.FC = () => {
  const {
    orders,
    routes,
    updateOrderStatus,
    currency,
    unseenOrdersCount,
    clearUnseenOrders,
    triggerTestAlarm
  } = useDms();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [routeFilter, setRouteFilter] = useState<string>('ALL');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (routeFilter !== 'ALL' && o.routeId !== routeFilter) return false;
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'RECEIVED':
        return { label: 'Received', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: Clock };
      case 'PROCESSING':
        return { label: 'Processing', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: PackageCheck };
      case 'DISPATCHED':
        return { label: 'Dispatched', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Truck };
      case 'DELIVERED':
        return { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle2 };
      case 'CANCELLED':
        return { label: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-300', icon: XCircle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Order Audio Alarm Banner if new orders incoming */}
      {unseenOrdersCount > 0 && (
        <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-indigo-600 text-white rounded-xl p-4 shadow-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <BellRing className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base">
                🚨 New Wholesale Order Received! ({unseenOrdersCount} New)
              </div>
              <p className="text-xs text-white/90">
                Audible dispatch alarm was triggered. Verify the order and stage picking items immediately.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={triggerTestAlarm}
              className="px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/40 text-xs font-bold"
            >
              Replay Siren
            </button>
            <button
              onClick={clearUnseenOrders}
              className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-slate-100 transition-colors"
            >
              Acknowledge Alert
            </button>
          </div>
        </div>
      )}

      {/* Filter and Summary Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['ALL', 'RECEIVED', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Orders' : st}
            </button>
          ))}
        </div>

        {/* Route Filter */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <select
            value={routeFilter}
            onChange={e => setRouteFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-slate-300 font-semibold bg-slate-50 text-slate-700"
          >
            <option value="ALL">All Delivery Routes</option>
            {routes.map(r => (
              <option key={r.id} value={r.id}>
                {r.routeName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Client Enterprise</th>
                <th className="py-3 px-4">Route & Cutoff</th>
                <th className="py-3 px-4">Items / Packs</th>
                <th className="py-3 px-4 text-right">Wholesale Total</th>
                <th className="py-3 px-4 text-center">Dispatch Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(order => {
                const badge = getStatusBadge(order.status);
                const StatusIcon = badge.icon;
                const totalPacks = order.items.reduce((sum, it) => sum + it.quantity, 0);

                return (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 font-mono">
                        {order.orderNumber}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {order.user?.shopName || order.user?.ownerName || 'Retail Client'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {order.user?.ownerName} • {order.user?.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">
                        {order.route?.routeName || 'Main Route'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Delivery: {order.route?.deliveryDay || 'Weekly'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] border border-indigo-200">
                        {totalPacks} Packs ({order.items.length} SKUs)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="font-bold text-slate-900 text-sm">
                        {formatCurrency(order.totalAmount, currency)}
                      </div>
                      {order.totalMrpAmount && (
                        <div className="text-[10px] text-slate-400 line-through">
                          MRP: {formatCurrency(order.totalMrpAmount, currency)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-block">
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border cursor-pointer focus:outline-none ${badge.color}`}
                        >
                          <option value="RECEIVED">Received</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="DISPATCHED">Dispatched</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center gap-1 border border-slate-300 transition-colors"
                        title="Print Packing Slip & Invoice"
                      >
                        <Printer className="w-3.5 h-3.5 text-indigo-600" />
                        Slip / Invoice
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoiceOrder && (
        <DeliveryInvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useDms } from '../context/DmsContext.tsx';
import { formatCurrency } from '../utils/pricing.ts';
import { PackageCheck, Clock, Truck, CheckCircle2, XCircle, Printer, FileText, ChevronRight } from 'lucide-react';
import { Order } from '../types/index.ts';
import { DeliveryInvoiceModal } from './admin/DeliveryInvoiceModal.tsx';

export const ClientOrdersView: React.FC = () => {
  const { orders, currentUser, currency } = useDms();
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Filter orders for current logged in user (or all if Super Admin is browsing)
  const userOrders = currentUser?.role === 'SUPER_ADMIN'
    ? orders
    : orders.filter(o => o.userId === currentUser?.id);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'RECEIVED':
        return {
          label: 'Order Received',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Clock
        };
      case 'PROCESSING':
        return {
          label: 'Packing & Staging',
          color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          icon: PackageCheck
        };
      case 'DISPATCHED':
        return {
          label: 'Out for Route Delivery',
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: Truck
        };
      case 'DELIVERED':
        return {
          label: 'Delivered & Completed',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          color: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: XCircle
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-indigo-600" />
            Wholesale Orders & Dispatch History
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track route delivery status, inspect itemized pack slips, and print invoices.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <div>
            <span className="text-slate-400">Total Orders:</span>
            <span className="font-bold text-slate-900 ml-1">{userOrders.length}</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400">Active Deliveries:</span>
            <span className="font-bold text-indigo-600 ml-1">
              {userOrders.filter(o => o.status === 'RECEIVED' || o.status === 'PROCESSING' || o.status === 'DISPATCHED').length}
            </span>
          </div>
        </div>
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-sm">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-400 mt-1">
            Browse the wholesale catalog or bulk matrix to create your first order.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map(order => {
            const badge = getStatusBadge(order.status);
            const StatusIcon = badge.icon;
            const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs font-mono">
                      #{order.orderNumber.replace('BIS-', '')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          Order {order.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badge.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {badge.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {order.route && ` • Route: ${order.route.routeName}`}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-indigo-600" />
                      Print Delivery Invoice
                    </button>
                  </div>
                </div>

                {/* Progress Pipeline */}
                <div className="p-4 border-b border-slate-100 bg-white">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { status: 'RECEIVED', label: '1. Received' },
                      { status: 'PROCESSING', label: '2. Staging / Picking' },
                      { status: 'DISPATCHED', label: '3. Dispatched' },
                      { status: 'DELIVERED', label: '4. Delivered' }
                    ].map((step, idx) => {
                      const stages = ['RECEIVED', 'PROCESSING', 'DISPATCHED', 'DELIVERED'];
                      const currentIdx = stages.indexOf(order.status);
                      const isComplete = currentIdx >= idx;
                      const isCurrent = order.status === step.status;

                      return (
                        <div key={step.status} className="flex flex-col items-center">
                          <div
                            className={`w-full h-1.5 rounded-full mb-1.5 transition-colors ${
                              isComplete ? 'bg-indigo-600' : 'bg-slate-200'
                            }`}
                          />
                          <span
                            className={`text-[11px] font-bold ${
                              isCurrent
                                ? 'text-indigo-600'
                                : isComplete
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items Summary */}
                <div className="p-4 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Pack Items Ordered ({totalItemsCount} packs)
                  </div>
                  <div className="divide-y divide-slate-100">
                    {order.items.map(item => (
                      <div
                        key={item.id}
                        className="py-2 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-800">
                            {item.product?.name || 'Product SKU'}
                          </span>
                          <span className="text-slate-400 text-[11px] ml-2">
                            ({item.product?.packUnit || 'Pack'})
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <span className="font-mono text-slate-600">
                            {item.quantity} × {formatCurrency(item.unitPrice, currency)}
                          </span>
                          <span className="font-bold text-slate-900 w-24">
                            {formatCurrency(item.subtotal, currency)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="mt-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600">
                      <strong>Dispatch Note:</strong> {order.notes}
                    </div>
                  )}

                  {/* Total row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Wholesale Total Amount:</span>
                    <span className="text-base font-extrabold text-indigo-600">
                      {formatCurrency(order.totalAmount, currency)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <DeliveryInvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};

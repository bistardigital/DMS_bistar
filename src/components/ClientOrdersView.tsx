import React, { useState } from 'react';
import { useDms } from '../context/DmsContext.tsx';
import { formatCurrency } from '../utils/pricing.ts';
import { PackageCheck, Clock, Truck, CheckCircle2, XCircle, Printer, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { WholesaleOrder } from '../types/index.ts';
import { DeliveryInvoiceModal } from './admin/DeliveryInvoiceModal.tsx';

export const ClientOrdersView: React.FC = () => {
  const { orders, currentUser, currency } = useDms();
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<WholesaleOrder | null>(null);

  // Filter orders for current logged in user (or all if Super Admin is browsing)
  const userOrders = currentUser?.role === 'SUPER_ADMIN'
    ? orders
    : orders.filter(o => o.userId === currentUser?.id || o.shopId === currentUser?.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RECEIVED':
      case 'NEW_ALARM':
        return {
          label: 'অর্ডার প্রাপ্তি (Received)',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Clock
        };
      case 'PROCESSING':
      case 'CONFIRMED':
      case 'PACKED':
        return {
          label: 'প্যাকিং ও স্টোর প্রস্তুতি (Staging)',
          color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          icon: PackageCheck
        };
      case 'DISPATCHED':
      case 'ON_ROUTE':
        return {
          label: 'রুটে সরবরাহ চলছে (Out for Delivery)',
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: Truck
        };
      case 'DELIVERED':
        return {
          label: 'বিতরণ সম্পন্ন (Delivered)',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2
        };
      default:
        return {
          label: 'বাতিল (Cancelled)',
          color: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: XCircle
        };
    }
  };

  const getPaymentBadge = (method: string) => {
    switch (method) {
      case 'ROUTE_COD':
        return { label: 'ক্যাশ অন ডেলিভারি (COD)', icon: Banknote, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'CREDIT_LEDGER':
        return { label: 'বাকি খাতা (Credit Ledger)', icon: CreditCard, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
      case 'BKASH':
        return { label: 'বিকাশ (bKash)', icon: Smartphone, color: 'text-pink-700 bg-pink-50 border-pink-200' };
      case 'NAGAD':
        return { label: 'নগদ (Nagad)', icon: Smartphone, color: 'text-orange-700 bg-orange-50 border-orange-200' };
      default:
        return { label: method, icon: Banknote, color: 'text-slate-700 bg-slate-50 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-indigo-600" />
            পাইকারি অর্ডার ও চালান ইনভয়েস হিস্ট্রি (Order History)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            রুট ডেলিভারির লাইভ ট্র্যাকিং, কার্টুন পরিমাণ এবং প্রিন্টযোগ্য অফিসিয়াল চালান দেখুন।
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-400">মোট অর্ডার:</span>
            <span className="font-bold text-slate-900 ml-1">{userOrders.length}</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400">রুটে থাকা ডেলিভারি:</span>
            <span className="font-bold text-indigo-600 ml-1">
              {userOrders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length}
            </span>
          </div>
        </div>
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-sm">কোনো অর্ডার পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-400 mt-1">
            পণ্য ক্যাটালগ অথবা বাল্ক অর্ডার শিট থেকে পাইকারি পণ্য নির্বাচন করে অর্ডার তৈরি করুন।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map(order => {
            const currentStatus = order.orderStatus || order.status || 'RECEIVED';
            const badge = getStatusBadge(currentStatus);
            const StatusIcon = badge.icon;
            const totalItemsCount = order.totalCartons || order.items.reduce((sum, item) => sum + item.quantity, 0);
            const invNumber = order.invoiceNumber || order.orderNumber || order.id;
            const totalAmount = order.totalWholesaleBdt ?? order.totalAmount ?? 0;
            const payBadge = getPaymentBadge(order.paymentMethod);
            const PayIcon = payBadge.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs font-mono">
                      #{invNumber.replace('BIS-', '')}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          চালান {invNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${badge.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {badge.label}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${payBadge.color}`}
                        >
                          <PayIcon className="w-3 h-3" />
                          {payBadge.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        তারিখ: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {(order.routeName || order.route?.routeName) && ` • রুট: ${order.routeName || order.route?.routeName}`}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-indigo-600" />
                      চালান প্রিন্ট / PDF
                    </button>
                  </div>
                </div>

                {/* Progress Pipeline */}
                <div className="p-4 border-b border-slate-100 bg-white">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { status: 'RECEIVED', label: '১. প্রাপ্তি' },
                      { status: 'PROCESSING', label: '২. প্যাকিং' },
                      { status: 'DISPATCHED', label: '৩. ডেলিভারি রুট' },
                      { status: 'DELIVERED', label: '৪. সম্পন্ন' }
                    ].map((step, idx) => {
                      const stages = ['RECEIVED', 'PROCESSING', 'DISPATCHED', 'DELIVERED'];
                      const currentIdx = stages.indexOf(currentStatus === 'NEW_ALARM' ? 'RECEIVED' : currentStatus === 'CONFIRMED' || currentStatus === 'PACKED' ? 'PROCESSING' : currentStatus === 'ON_ROUTE' ? 'DISPATCHED' : currentStatus);
                      const isComplete = currentIdx >= idx;
                      const isCurrent = currentIdx === idx;

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
                    অর্ডারকৃত পণ্য তালিকা ({totalItemsCount} কার্টুন/প্যাক)
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
                            ({item.product?.packSize || item.product?.packUnit || 'Pack'})
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
                    <div className="mt-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-600">
                      <strong>ডেলিভারি নোট:</strong> {order.notes}
                    </div>
                  )}

                  {/* Total row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">মোট পাইকারি প্রদেয় মূল্য:</span>
                    <span className="text-base font-extrabold text-indigo-600">
                      {formatCurrency(totalAmount, currency)}
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

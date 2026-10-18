import React, { useState } from 'react';
import { useDms } from '../context/DmsContext.tsx';
import { canAccessB2BPricing, calculateOrderTotals, formatCurrency } from '../utils/pricing.ts';
import { X, Trash2, ShoppingBag, ArrowRight, TrendingUp, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  openRegistrationModal: () => void;
  goToOrders: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  openRegistrationModal,
  goToOrders
}) => {
  const {
    cart,
    updateCartQty,
    removeFromCart,
    clearCart,
    placeOrder,
    currentUser,
    routes,
    currency
  } = useDms();

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const access = canAccessB2BPricing(currentUser);
  const isApproved = access.allowed;
  const totals = calculateOrderTotals(cart, isApproved);

  const userRoute = currentUser?.routeId
    ? routes.find(r => r.id === currentUser.routeId)
    : routes[0];

  const handleCheckout = () => {
    if (!isApproved) {
      openRegistrationModal();
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const order = placeOrder(notes);
      setIsSubmitting(false);
      if (order) {
        setOrderSuccess(order.orderNumber);
        setNotes('');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <div>
                <h2 className="text-base font-bold">Wholesale Order Cart</h2>
                <span className="text-xs text-slate-400">{cart.length} unique products</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {orderSuccess ? (
            /* Success confirmation screen */
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Order Placed Successfully!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Order <strong className="text-indigo-600">{orderSuccess}</strong> has been transmitted to warehouse dispatch.
              </p>
              <p className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg mt-3">
                🔔 The warehouse audio dispatch siren has notified the distribution team!
              </p>

              <div className="mt-6 flex flex-col w-full gap-2">
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    onClose();
                    goToOrders();
                  }}
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  View My Order Status & Invoices
                </button>
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Route banner */}
                {userRoute && (
                  <div className="bg-indigo-50/80 rounded-xl p-3 border border-indigo-100 text-xs">
                    <div className="flex items-center justify-between font-bold text-indigo-900">
                      <span>Dispatch Route:</span>
                      <span>{userRoute.routeName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-indigo-700 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Delivery: {userRoute.deliveryDay} (Cutoff: {userRoute.orderCutoffDay})</span>
                    </div>
                  </div>
                )}

                {/* Savings Banner */}
                {isApproved && totals.retailerSavings > 0 && (
                  <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Estimated Dealer Margin:
                    </span>
                    <span className="text-emerald-700 font-bold text-sm">
                      +{formatCurrency(totals.retailerSavings, currency)}
                    </span>
                  </div>
                )}

                {/* Items List */}
                {cart.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Your cart is empty</p>
                    <p className="text-xs text-slate-400 mt-1">Add pack units from the wholesale catalog</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => {
                      const itemSubtotal = (isApproved ? item.product.b2bPrice : item.product.mrpPrice) * item.quantity;

                      return (
                        <div
                          key={item.product.id}
                          className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-start justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 text-xs leading-snug truncate">
                              {item.product.name}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {item.product.sku} • {item.product.packUnit}
                            </div>
                            <div className="text-xs font-bold text-indigo-600 mt-1">
                              {isApproved ? (
                                <span>{formatCurrency(item.product.b2bPrice, currency)} / pack</span>
                              ) : (
                                <span className="text-slate-600">{formatCurrency(item.product.mrpPrice, currency)}</span>
                              )}
                            </div>

                            {/* Stepper */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                                <button
                                  onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold"
                                  aria-label="Decrease quantity"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-slate-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-[11px] text-slate-500">packs</span>
                            </div>
                          </div>

                          {/* Subtotal & Delete */}
                          <div className="text-right flex flex-col justify-between items-end self-stretch">
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="font-bold text-slate-900 text-xs">
                              {formatCurrency(itemSubtotal, currency)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Delivery Notes */}
                {cart.length > 0 && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dispatch Notes / Special Instructions
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Call store owner upon arrival, pack medicine items in waterproof bags..."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50"
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Total Pack Units:</span>
                      <span className="font-semibold text-slate-700">{totals.totalQuantity}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Consumer MRP Value:</span>
                      <span className="font-semibold text-slate-700 line-through">
                        {formatCurrency(totals.totalMrp, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                      <span>Wholesale Payable:</span>
                      <span className="text-indigo-600 text-base">
                        {formatCurrency(totals.totalB2B, currency)}
                      </span>
                    </div>
                  </div>

                  {!isApproved ? (
                    <button
                      onClick={openRegistrationModal}
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Client Approval Required to Submit Order
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckout}
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        'Transmitting to Warehouse...'
                      ) : (
                        <>
                          Transmit Wholesale Order <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

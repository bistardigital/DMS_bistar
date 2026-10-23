import React, { useState } from 'react';
import { useDms } from '../context/DmsContext.tsx';
import { canAccessB2BPricing, calculateOrderTotals, formatCurrency, getEffectiveTierPrice } from '../utils/pricing.ts';
import { PaymentMethod } from '../types/index.ts';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ROUTE_COD');
  const [paymentTrxId, setPaymentTrxId] = useState('');
  const [paymentSenderPhone, setPaymentSenderPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{
    invoiceNumber: string;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    routeName: string;
  } | null>(null);

  if (!isOpen) return null;

  const access = canAccessB2BPricing(currentUser);
  const isApproved = access.allowed;
  const totals = calculateOrderTotals(cart, isApproved);

  const userRoute = currentUser?.routeId
    ? routes.find(r => r.id === currentUser.routeId)
    : routes[0];

  // Credit Ledger calculations
  const creditLimit = currentUser?.creditLimitBdt || 0;
  const currentDue = currentUser?.currentDueBdt || 0;
  const remainingCredit = Math.max(0, creditLimit - currentDue);
  const willExceedCredit = paymentMethod === 'CREDIT_LEDGER' && (currentDue + totals.totalB2B > creditLimit);

  const handleCheckout = () => {
    setOrderError(null);
    if (!isApproved) {
      openRegistrationModal();
      return;
    }

    if (paymentMethod === 'CREDIT_LEDGER' && willExceedCredit) {
      setOrderError(`বাকি সীমা অতিক্রম করেছে! আপনার অবশিষ্ট বাকি সীমা ${formatCurrency(remainingCredit, currency)}। অনুগ্রহ করে বাকি পরিশোধ করুন বা ক্যাশ অন ডেলিভারি নির্বাচন করুন।`);
      return;
    }

    if ((paymentMethod === 'BKASH' || paymentMethod === 'NAGAD' || paymentMethod === 'ROCKET') && !paymentTrxId.trim()) {
      setOrderError('অনুগ্রহ করে মোবাইল ব্যাংকিং এর Transaction ID (TrxID) প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = placeOrder({
        notes,
        paymentMethod,
        paymentTrxId: paymentTrxId.trim() || undefined,
        paymentSenderPhone: paymentSenderPhone.trim() || undefined,
        paidAmountBdt: paymentMethod === 'CREDIT_LEDGER' ? 0 : totals.totalB2B
      });

      setIsSubmitting(false);
      if (result.success && result.order) {
        setOrderSuccess({
          invoiceNumber: result.order.invoiceNumber || result.order.orderNumber || result.order.id,
          totalAmount: result.order.totalWholesaleBdt ?? result.order.totalAmount ?? totals.totalB2B,
          paymentMethod: options.paymentMethod,
          routeName: userRoute?.routeName || 'Standard Route'
        });
        setNotes('');
        setPaymentTrxId('');
        setPaymentSenderPhone('');
      } else {
        setOrderError(result.error || 'অর্ডার সাবমিট করতে সমস্যা হয়েছে।');
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <div>
                <h2 className="text-base font-bold">পাইকারি অর্ডার কার্ট (B2B Cart)</h2>
                <span className="text-xs text-slate-400">{cart.length} টি অনন্য পণ্য</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {orderSuccess ? (
            /* Success confirmation screen */
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  অর্ডার নিশ্চিতকরণ সম্পন্ন
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">অর্ডার সফলভাবে গ্রহণ করা হয়েছে!</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  চালান নং: <strong className="text-indigo-600 font-mono text-sm">{orderSuccess.invoiceNumber}</strong>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left w-full text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>ডেলিভারি রুট:</span>
                  <span className="font-bold text-slate-800">{orderSuccess.routeName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>পরিশোধের মাধ্যম:</span>
                  <span className="font-bold text-slate-800">{orderSuccess.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>মোট পরিমাণ:</span>
                  <span className="font-extrabold text-indigo-600">{formatCurrency(orderSuccess.totalAmount, currency)}</span>
                </div>
                <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg mt-2 border border-emerald-200">
                  🔔 ডিস্ট্রিবিউশন হাবের সাউন্ড অ্যালার্ম সিস্টেমে এই অর্ডারটির সংকেত পাঠানো হয়েছে।
                </div>
              </div>

              <div className="flex flex-col w-full gap-2 pt-2">
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    onClose();
                    goToOrders();
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  আমার অর্ডার ও চালান ইনভয়েস দেখুন
                </button>
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  আরও কেনাকাটা করুন
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Route banner */}
                {userRoute && (
                  <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 text-xs">
                    <div className="flex items-center justify-between font-bold text-indigo-950">
                      <span>ডেলিভারি রুট:</span>
                      <span>{userRoute.routeName}</span>
                    </div>
                    <div className="flex items-center justify-between text-indigo-700 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> শিডিউল: {userRoute.deliveryDays}
                      </span>
                      <span className="text-[11px] text-indigo-600">কাট-অফ: {userRoute.cutoffTime}</span>
                    </div>
                  </div>
                )}

                {/* Savings Banner */}
                {isApproved && totals.retailerSavings > 0 && (
                  <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      দোকানদারের সাশ্রয় / মুনাফা:
                    </span>
                    <span className="text-emerald-700 font-extrabold text-sm">
                      +{formatCurrency(totals.retailerSavings, currency)}
                    </span>
                  </div>
                )}

                {/* Error Banner */}
                {orderError && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{orderError}</span>
                  </div>
                )}

                {/* Items List */}
                {cart.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">কার্ট খালি রয়েছে</p>
                    <p className="text-xs text-slate-400 mt-1">ক্যাটালগ থেকে পাইকারি পণ্য কার্টে যোগ করুন</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => {
                      const tierResult = getEffectiveTierPrice(item.product, item.quantity, isApproved);
                      const itemSubtotal = tierResult.unitPrice * item.quantity;

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
                              {item.product.skuCode || item.product.sku} • {item.product.packSize || item.product.packUnit}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-bold text-indigo-700">
                                {formatCurrency(tierResult.unitPrice, currency)} / প্যাক
                              </span>
                              {isApproved && tierResult.tier > 1 && (
                                <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                                  Tier {tierResult.tier} রেট
                                </span>
                              )}
                            </div>

                            {/* Stepper */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                                <button
                                  onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                                  aria-label="Decrease quantity"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-slate-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-[11px] text-slate-500">কার্টুন / প্যাক</span>
                            </div>
                          </div>

                          {/* Subtotal & Delete */}
                          <div className="text-right flex flex-col justify-between items-end self-stretch">
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
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

                {/* Local Payment Method Selector */}
                {cart.length > 0 && isApproved && (
                  <div className="pt-2 border-t border-slate-200 space-y-2.5">
                    <label className="block text-xs font-bold text-slate-800">
                      পরিশোধের মাধ্যম (Payment Method)
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      {/* COD */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('ROUTE_COD')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          paymentMethod === 'ROUTE_COD'
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Banknote className="w-4 h-4 text-emerald-600 mb-1" />
                        <div className="text-[11px] leading-tight">ক্যাশ অন ডেলিভারি</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Route COD</div>
                      </button>

                      {/* Credit Ledger */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('CREDIT_LEDGER')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          paymentMethod === 'CREDIT_LEDGER'
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-indigo-600 mb-1" />
                        <div className="text-[11px] leading-tight">বাকি খাতা</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Shop Credit</div>
                      </button>

                      {/* Mobile Banking */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('BKASH')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          paymentMethod === 'BKASH' || paymentMethod === 'NAGAD' || paymentMethod === 'ROCKET'
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-pink-600 mb-1" />
                        <div className="text-[11px] leading-tight">মোবাইল ব্যাংকিং</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">bKash / Nagad</div>
                      </button>
                    </div>

                    {/* Credit Ledger Details Box */}
                    {paymentMethod === 'CREDIT_LEDGER' && (
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
                        <div className="flex justify-between text-slate-600">
                          <span>অনুমোদিত বাকি সীমা (Limit):</span>
                          <span className="font-bold text-slate-800">{formatCurrency(creditLimit, currency)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>বর্তমান বাকি (Current Due):</span>
                          <span className="font-bold text-amber-700">{formatCurrency(currentDue, currency)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                          <span>অবশিষ্ট বাকি সীমা (Available):</span>
                          <span className={`font-bold ${remainingCredit >= totals.totalB2B ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {formatCurrency(remainingCredit, currency)}
                          </span>
                        </div>
                        {willExceedCredit && (
                          <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg mt-1 border border-rose-200 font-semibold">
                            ⚠️ এই অর্ডারের মোট মূল্য আপনার অবশিষ্ট বাকি সীমার চেয়ে বেশি।
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mobile Banking Box */}
                    {(paymentMethod === 'BKASH' || paymentMethod === 'NAGAD' || paymentMethod === 'ROCKET') && (
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2.5 text-xs">
                        <div className="flex gap-2">
                          {(['BKASH', 'NAGAD', 'ROCKET'] as PaymentMethod[]).map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setPaymentMethod(m)}
                              className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                                paymentMethod === m
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {m === 'BKASH' ? 'bKash Merchant' : m === 'NAGAD' ? 'Nagad Merchant' : 'Rocket'}
                            </button>
                          ))}
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] space-y-1">
                          <div className="text-slate-500">
                            মার্চেন্ট একাউন্ট নম্বর ({paymentMethod}):{' '}
                            <strong className="text-slate-900 font-mono">
                              {paymentMethod === 'BKASH' ? '01700-000001' : paymentMethod === 'NAGAD' ? '01900-000002' : '01800-000003'}
                            </strong>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            'Make Payment' অপশন ব্যবহার করে {formatCurrency(totals.totalB2B, currency)} পাঠান।
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">TrxID (লেনদেন আইডি) *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. BL9910AK"
                              value={paymentTrxId}
                              onChange={e => setPaymentTrxId(e.target.value)}
                              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white uppercase font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">প্রেরকের নম্বর</label>
                            <input
                              type="tel"
                              placeholder="017xxxxxxxx"
                              value={paymentSenderPhone}
                              onChange={e => setPaymentSenderPhone(e.target.value)}
                              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Delivery Notes */}
                {cart.length > 0 && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ডেলিভারি নির্দেশাবলী / বিশেষ নোট
                    </label>
                    <textarea
                      rows={2}
                      placeholder="যেমন: দোকানে পৌঁছালে কল করবেন, ওষুধের বক্স ওয়াটারপ্রুফ ব্যাগে প্যাক করুন..."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50"
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>মোট কার্টুন / প্যাক সংখ্যা:</span>
                      <span className="font-semibold text-slate-700">{totals.totalQuantity}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>ভোক্তা MRP মূল্য:</span>
                      <span className="font-semibold text-slate-700 line-through">
                        {formatCurrency(totals.totalMrp, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                      <span>পাইকারি প্রদেয় মূল্য (Wholesale Payable):</span>
                      <span className="text-indigo-600 text-base">
                        {formatCurrency(totals.totalB2B, currency)}
                      </span>
                    </div>
                  </div>

                  {!isApproved ? (
                    <button
                      onClick={openRegistrationModal}
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      অর্ডার সাবমিট করতে দোকান অনুমোদন প্রয়োজন
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckout}
                      disabled={isSubmitting || willExceedCredit}
                      className={`w-full py-3 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        willExceedCredit
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-98'
                      }`}
                    >
                      {isSubmitting ? (
                        'ওয়্যারহাউজে প্রেরণ করা হচ্ছে...'
                      ) : (
                        <>
                          পাইকারি অর্ডার নিশ্চিত করুন <ArrowRight className="w-4 h-4" />
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

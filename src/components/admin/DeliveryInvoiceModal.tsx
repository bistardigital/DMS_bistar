import React from 'react';
import { WholesaleOrder } from '../../types/index.ts';
import { useDms } from '../../context/DmsContext.tsx';
import { formatCurrency } from '../../utils/pricing.ts';
import { Printer, X, CheckCircle, QrCode, Boxes, CreditCard, Banknote, Smartphone } from 'lucide-react';

interface DeliveryInvoiceModalProps {
  order: WholesaleOrder;
  onClose: () => void;
}

export const DeliveryInvoiceModal: React.FC<DeliveryInvoiceModalProps> = ({
  order,
  onClose
}) => {
  const { currency, users } = useDms();
  const clientUser = order.user || users.find(u => u.id === order.userId || u.id === order.shopId);

  const handlePrint = () => {
    window.print();
  };

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalWholesale = order.totalWholesaleBdt ?? order.totalAmount ?? 0;
  const totalMrp = order.subtotalMrpBdt ?? order.totalMrpAmount ?? (totalWholesale * 1.15);
  const savings = Math.max(0, totalMrp - totalWholesale);

  const getPaymentLabel = () => {
    switch (order.paymentMethod) {
      case 'ROUTE_COD':
        return { label: 'ক্যাশ অন ডেলিভারি (Route COD)', desc: 'পণ্য পাওয়ার পর ড্রাইভারের কাছে নগদ প্রদেয়' };
      case 'CREDIT_LEDGER':
        return { label: 'দোকানের বাকি খাতা (Shop Credit Ledger)', desc: 'দোকানের অনুমোদিত বাকি হিসেবে যুক্ত করা হয়েছে' };
      case 'BKASH':
        return { label: `বিকাশ পেমেন্ট (bKash TrxID: ${order.paymentTrxId || 'N/A'})`, desc: `প্রেরক: ${order.paymentSenderPhone || 'N/A'}` };
      case 'NAGAD':
        return { label: `নগদ পেমেন্ট (Nagad TrxID: ${order.paymentTrxId || 'N/A'})`, desc: `প্রেরক: ${order.paymentSenderPhone || 'N/A'}` };
      case 'ROCKET':
        return { label: `রকেট পেমেন্ট (Rocket TrxID: ${order.paymentTrxId || 'N/A'})`, desc: `প্রেরক: ${order.paymentSenderPhone || 'N/A'}` };
      default:
        return { label: 'ক্যাশ অন ডেলিভারি (Route COD)', desc: 'ড্রাইভারের কাছে নগদ প্রদেয়' };
    }
  };

  const paymentInfo = getPaymentLabel();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 print:my-0 print:border-none print:shadow-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">অফিসিয়াল বিটুবি ডেলিভারি চালান ও ইনভয়েস (Official Invoice & Packing Slip)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              প্রিন্ট বা PDF সংরক্ষণ করুন
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 bg-white" id="printable-invoice">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm">
                  B
                </div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  BISTAR B2B-DMS
                </h1>
              </div>
              <p className="text-xs text-slate-600 font-bold mt-1">
                সার্বজনীন পাইকারি ডিস্ট্রিবিউশন ডিপো ও সাপ্লাই হাব
              </p>
              <p className="text-[11px] text-slate-500">
                অনুমোদিত FMCG, ফার্মাসিউটিক্যালস ও এগ্রো ইনপুট পরিবেশক
              </p>
            </div>

            {/* Invoice Meta */}
            <div className="text-right">
              <div className="inline-block bg-slate-100 text-slate-900 font-mono font-black text-sm px-3 py-1 rounded-lg border border-slate-300">
                চালান নং: #{order.invoiceNumber || order.orderNumber || order.id}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                তারিখ: {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="text-xs font-bold text-indigo-700">
                রুট: {order.routeName || order.route?.routeName || 'স্ট্যান্ডার্ড রুট'}
              </div>
            </div>
          </div>

          {/* Client & Route Dispatch Details */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                গ্রাহক / খুচরা দোকানদার বিবরণ:
              </span>
              <div className="font-extrabold text-sm text-slate-900">
                {order.shopName || clientUser?.shopName || 'Retail Client Store'}
              </div>
              <div className="text-slate-700 mt-0.5">
                স্বত্বাধিকারী: <strong>{order.ownerName || clientUser?.ownerName || 'Store Manager'}</strong>
              </div>
              <div className="text-slate-700">
                মোবাইল: <strong className="font-mono">{order.shopPhone || clientUser?.phone || 'N/A'}</strong>
              </div>
              {clientUser?.tradeLicenseNo && (
                <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                  ট্রেড লাইসেন্স: {clientUser.tradeLicenseNo}
                </div>
              )}
            </div>

            <div className="text-right sm:text-left sm:pl-6 border-l border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                ডেলিভারি ও পেমেন্ট বিবরণ:
              </span>
              <div className="font-bold text-slate-800">
                ডেলিভারি রুট: {order.routeName || order.route?.routeName || 'Main Market'}
              </div>
              <div className="text-slate-600">
                পরিশোধ মাধ্যম: <strong className="text-slate-900">{paymentInfo.label}</strong>
              </div>
              <div className="text-[11px] text-slate-500">
                {paymentInfo.desc}
              </div>
              {order.notes && (
                <div className="text-amber-800 text-[11px] mt-1 italic font-medium bg-amber-50 p-1.5 rounded">
                  নোট: "{order.notes}"
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">SKU ও পণ্যের বিবরণ</th>
                  <th className="py-2.5 px-3">প্যাক সাইজ</th>
                  <th className="py-2.5 px-3 text-right">খুচরা MRP</th>
                  <th className="py-2.5 px-3 text-center">পরিমাণ</th>
                  <th className="py-2.5 px-3 text-right">পাইকারি রেট</th>
                  <th className="py-2.5 px-3 text-right">মোট (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={item.id} className="text-slate-800">
                    <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <div className="font-bold">{item.product?.name || 'Wholesale SKU'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.product?.skuCode || item.product?.sku} {item.product?.genericName ? `• ${item.product.genericName}` : ''}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-700">
                        {item.product?.packSize || item.product?.packUnit || 'Pack'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-slate-500">
                      {formatCurrency(item.mrpPrice || item.product?.mrpBdt || item.product?.mrpPrice || 0, currency)}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-slate-900">
                      {item.quantity} কার্টুন
                    </td>
                    <td className="py-2 px-3 text-right font-semibold">
                      {formatCurrency(item.unitPrice, currency)}
                    </td>
                    <td className="py-2 px-3 text-right font-extrabold text-slate-900">
                      {formatCurrency(item.subtotal, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & QR Code verification */}
          <div className="grid grid-cols-2 gap-6 pt-2">
            {/* Dispatch Barcode Graphic & QR */}
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="p-2 bg-white rounded-lg border border-slate-300">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[11px] text-slate-600">
                <div className="font-bold text-slate-800">ওয়্যারহাউজ ভেরিফিকেশন কোড</div>
                <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                  ID: {order.id.toUpperCase()}
                </div>
                <div className="text-emerald-700 font-bold mt-1">
                  ✓ গেট পাস ও চালান অনুমোদিত
                </div>
              </div>
            </div>

            {/* Amount Summary */}
            <div className="space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-500">
                <span>মোট কার্টুন / প্যাক:</span>
                <span className="font-bold text-slate-800">{totalQuantity} কার্টুন</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>ভোক্তা MRP মোট মূল্য:</span>
                <span className="font-semibold text-slate-700 line-through">
                  {formatCurrency(totalMrp, currency)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>দোকানদারের সাশ্রয় / লাভ:</span>
                <span>
                  -{formatCurrency(savings, currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t-2 border-slate-900">
                <span>মোট প্রদেয় পাইকারি মূল্য:</span>
                <span className="text-indigo-600 text-base">
                  {formatCurrency(totalWholesale, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs text-slate-600 border-t border-slate-200">
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 mb-1" />
              <div className="font-bold text-slate-800">ওয়্যারহাউজ অফিসার</div>
              <div className="text-[10px] text-slate-400">পণ্য পিক ও যাচাইকৃত</div>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 mb-1" />
              <div className="font-bold text-slate-800">রুট ডেলিভারি ড্রাইভার</div>
              <div className="text-[10px] text-slate-400">ভ্যান / ট্রাক হ্যান্ডওভার</div>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 mb-1" />
              <div className="font-bold text-slate-800">গ্রাহক দোকানদার</div>
              <div className="text-[10px] text-slate-400">সিলমোহর ও স্বাক্ষর</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

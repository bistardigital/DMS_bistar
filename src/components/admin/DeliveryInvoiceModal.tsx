import React from 'react';
import { Order } from '../../types/index.ts';
import { useDms } from '../../context/DmsContext.tsx';
import { formatCurrency } from '../../utils/pricing.ts';
import { Printer, X, CheckCircle, QrCode, Boxes } from 'lucide-react';

interface DeliveryInvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const DeliveryInvoiceModal: React.FC<DeliveryInvoiceModalProps> = ({
  order,
  onClose
}) => {
  const { currency, users } = useDms();
  const clientUser = order.user || users.find(u => u.id === order.userId);

  const handlePrint = () => {
    window.print();
  };

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 print:my-0 print:border-none print:shadow-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Official B2B Delivery Invoice & Packing Slip</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
              <p className="text-xs text-slate-500 font-medium mt-1">
                Central Wholesale Distribution & Supply Depot
              </p>
              <p className="text-[11px] text-slate-500">
                Authorized FMCG, Pharma & Agro Trade Distributor
              </p>
            </div>

            {/* Invoice Meta */}
            <div className="text-right">
              <div className="inline-block bg-slate-100 text-slate-800 font-mono font-bold text-sm px-2.5 py-1 rounded border border-slate-300">
                INVOICE: #{order.orderNumber}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="text-xs font-semibold text-indigo-700">
                Route: {order.route?.routeName || 'Standard Route'}
              </div>
            </div>
          </div>

          {/* Client & Route Dispatch Details */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                B2B Consignee / Retailer:
              </span>
              <div className="font-bold text-sm text-slate-900">
                {clientUser?.shopName || 'Retail Client Store'}
              </div>
              <div className="text-slate-600 mt-0.5">
                Proprietor: <strong>{clientUser?.ownerName || 'Store Manager'}</strong>
              </div>
              <div className="text-slate-600">
                Phone: <strong>{clientUser?.phone || 'N/A'}</strong>
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Account Status: {clientUser?.status || 'APPROVED'}
              </div>
            </div>

            <div className="text-right sm:text-left sm:pl-6 border-l border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Delivery Schedule & Dispatch:
              </span>
              <div className="font-semibold text-slate-800">
                Assigned Route: {order.route?.routeName || 'Main Market'}
              </div>
              <div className="text-slate-600">
                Scheduled Delivery Day: <strong>{order.route?.deliveryDay || 'Next Tuesday'}</strong>
              </div>
              <div className="text-slate-600">
                Dispatch Order Status: <strong className="text-indigo-600">{order.status}</strong>
              </div>
              {order.notes && (
                <div className="text-amber-800 text-[11px] mt-1 italic font-medium">
                  Note: "{order.notes}"
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">SKU & Product Description</th>
                  <th className="py-2 px-3">Pack Unit</th>
                  <th className="py-2 px-3 text-right">MRP</th>
                  <th className="py-2 px-3 text-center">Packs</th>
                  <th className="py-2 px-3 text-right">B2B Rate</th>
                  <th className="py-2 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={item.id} className="text-slate-800">
                    <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <div className="font-bold">{item.product?.name || 'Wholesale SKU'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.product?.sku} {item.product?.genericName ? `• ${item.product.genericName}` : ''}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-700">
                        {item.product?.packUnit || 'Pack'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-slate-500">
                      {formatCurrency(item.product?.mrpPrice || 0, currency)}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-slate-900">
                      {item.quantity}
                    </td>
                    <td className="py-2 px-3 text-right font-medium">
                      {formatCurrency(item.unitPrice, currency)}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
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
                <div className="font-bold text-slate-800">Warehouse Scan Gate</div>
                <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                  ID: {order.id.toUpperCase()}
                </div>
                <div className="text-emerald-700 font-semibold mt-1">
                  ✓ Verified Route Gate Pass
                </div>
              </div>
            </div>

            {/* Amount Summary */}
            <div className="space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-500">
                <span>Total Pack Count:</span>
                <span className="font-bold text-slate-800">{totalQuantity} Packs</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Consumer MRP Gross:</span>
                <span className="font-semibold text-slate-700 line-through">
                  {formatCurrency(order.totalMrpAmount || order.totalAmount * 1.15, currency)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Client Margin Benefit:</span>
                <span>
                  -{formatCurrency(
                    (order.totalMrpAmount || order.totalAmount * 1.15) - order.totalAmount,
                    currency
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t-2 border-slate-900">
                <span>Net Wholesale Payable:</span>
                <span className="text-indigo-600 text-base">
                  {formatCurrency(order.totalAmount, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs text-slate-600 border-t border-slate-200">
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 mb-1" />
              <div className="font-bold text-slate-800">Warehouse Checker</div>
              <div className="text-[10px] text-slate-400">Goods Picked & Verified</div>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 mb-1" />
              <div className="font-bold text-slate-800">Route Delivery Driver</div>
              <div className="text-[10px] text-slate-400">Van / Truck Handover</div>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 mb-1" />
              <div className="font-bold text-slate-800">Client Receiver</div>
              <div className="text-[10px] text-slate-400">Shop Seal & Signature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

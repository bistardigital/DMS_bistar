import React, { useState } from 'react';
import { useDms } from '../../context/DmsContext.tsx';
import { generatePickList } from '../../utils/pricing.ts';
import { Printer, MapPin, PackageCheck, Calendar, Filter, CheckSquare } from 'lucide-react';

export const RoutePickList: React.FC = () => {
  const { routes, orders, products } = useDms();
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || 'ALL');

  const selectedRoute = routes.find(r => r.id === selectedRouteId);
  const pickListItems = generatePickList(orders, products, selectedRouteId);

  const totalPacks = pickListItems.reduce((sum, item) => sum + item.totalQuantity, 0);
  const relevantOrders = orders.filter(o =>
    o.status !== 'CANCELLED' && (selectedRouteId === 'ALL' || o.routeId === selectedRouteId)
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Route Selector & Print Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Warehouse Route-Wise Dispatch Pick-List
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated bulk picking sheet for warehouse dispatchers to load delivery vans by route.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Route dropdown */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <select
              value={selectedRouteId}
              onChange={e => setSelectedRouteId(e.target.value)}
              className="text-xs py-2 px-3 rounded-lg border border-slate-300 font-bold bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Delivery Routes Combined</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.routeName} (Delivery: {r.deliveryDay})
                </option>
              ))}
            </select>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Pick-List
          </button>
        </div>
      </div>

      {/* Pick List Sheet Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none" id="printable-picklist">
        {/* Printable Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-slate-900 uppercase tracking-tight">
                BISTAR B2B-DMS • Warehouse Pick-List
              </span>
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Van Staging Slip
              </span>
            </div>
            <div className="text-xs text-slate-600 font-medium mt-1">
              Target Route: <strong>{selectedRoute ? selectedRoute.routeName : 'All Combined Routes'}</strong>
              {selectedRoute && ` • Next Delivery: ${selectedRoute.deliveryDay}`}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Orders to Pick</span>
              <span className="font-bold text-slate-900 text-sm">{relevantOrders.length} Orders</span>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Pack Units</span>
              <span className="font-bold text-indigo-600 text-sm">{totalPacks} Packs</span>
            </div>
          </div>
        </div>

        {/* Table of aggregated items */}
        {pickListItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No active orders queued for this route yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Pick</th>
                  <th className="py-3 px-4">SKU / Item Description</th>
                  <th className="py-3 px-4">Pack Unit</th>
                  <th className="py-3 px-4 text-center font-black text-indigo-700">Total Packs to Pick</th>
                  <th className="py-3 px-4">Destinations (Client Stores & Quantities)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pickListItems.map((item, idx) => (
                  <tr key={item.productId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.productName}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {item.sku} {item.genericName ? `• ${item.genericName}` : ''}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {item.packUnit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-indigo-50 text-indigo-800 font-black text-base px-3 py-1 rounded-lg border border-indigo-200">
                        {item.totalQuantity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {item.destinations.map((dest, i) => (
                          <span
                            key={i}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-[11px] px-2 py-0.5 rounded font-medium"
                          >
                            <strong>{dest.shopName}</strong>: {dest.quantity}p ({dest.orderNumber})
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Dispatch Verification Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>Generated by BISTAR B2B-DMS Dispatch Engine</div>
          <div className="font-mono">Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
};

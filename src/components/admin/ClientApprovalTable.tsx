import React, { useState } from 'react';
import { useDms } from '../../context/DmsContext.tsx';
import { User, ClientStatus } from '../../types/index.ts';
import {
  UserCheck,
  UserX,
  Clock,
  ShieldCheck,
  Calendar,
  MapPin,
  Check,
  AlertCircle,
  Edit2
} from 'lucide-react';

export const ClientApprovalTable: React.FC = () => {
  const { users, routes, approveClient, suspendClient, updateClientValidity, updateProduct } = useDms();
  const [editingValidityUserId, setEditingValidityUserId] = useState<string | null>(null);
  const [customExpiryDate, setCustomExpiryDate] = useState<string>('');

  const b2bClients = users.filter(u => u.role === 'B2B_CLIENT');
  const pendingCount = b2bClients.filter(c => c.status === 'PENDING').length;

  const handleSaveValidity = (userId: string) => {
    if (customExpiryDate) {
      updateClientValidity(userId, new Date(customExpiryDate).toISOString());
    } else {
      updateClientValidity(userId, null);
    }
    setEditingValidityUserId(null);
  };

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{pendingCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Requires trade verification to unlock wholesale pricing</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Approved B2B Clients</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {b2bClients.filter(c => c.status === 'APPROVED').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active accounts with wholesale ordering privileges</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Suspended / Inactive</span>
            <UserX className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            {b2bClients.filter(c => c.status === 'SUSPENDED').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Wholesale access revoked or payment overdue</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Client Approval Gating & Access Validity
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review new retailer registrations, grant 6M / 1Y access validity, or suspend accounts.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Client Enterprise</th>
                <th className="py-3 px-4">Owner & Phone</th>
                <th className="py-3 px-4">Assigned Route</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Access Validity / Expiry</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {b2bClients.map(client => {
                const route = routes.find(r => r.id === client.routeId);
                const isEditingThis = editingValidityUserId === client.id;
                const isPending = client.status === 'PENDING';
                const isApproved = client.status === 'APPROVED';
                const isSuspended = client.status === 'SUSPENDED';

                const isExpired = client.accessExpires
                  ? new Date(client.accessExpires).getTime() < Date.now()
                  : false;

                return (
                  <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {client.shopName || client.ownerName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ID: {client.id}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{client.ownerName}</div>
                      <div className="text-[11px] text-indigo-600 font-mono mt-0.5 font-bold">
                        {client.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {route ? (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{route.routeName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isPending
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : isApproved
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        {isPending && <Clock className="w-3 h-3" />}
                        {isApproved && <UserCheck className="w-3 h-3" />}
                        {isSuspended && <UserX className="w-3 h-3" />}
                        {client.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {isEditingThis ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="date"
                            value={customExpiryDate}
                            onChange={e => setCustomExpiryDate(e.target.value)}
                            className="text-xs p-1 rounded border border-slate-300 bg-white"
                          />
                          <button
                            onClick={() => handleSaveValidity(client.id)}
                            className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                            title="Save Expiry"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {client.accessExpires ? (
                            <span className={isExpired ? 'text-rose-600 font-bold' : 'font-medium'}>
                              {new Date(client.accessExpires).toLocaleDateString()}
                              {isExpired && ' (EXPIRED)'}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">No expiry set</span>
                          )}
                          <button
                            onClick={() => {
                              setEditingValidityUserId(client.id);
                              setCustomExpiryDate(
                                client.accessExpires
                                  ? client.accessExpires.split('T')[0]
                                  : new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0]
                              );
                            }}
                            className="text-slate-400 hover:text-indigo-600 ml-1"
                            title="Set custom expiry date"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1 Year Approval */}
                        {(!isApproved || isExpired) && (
                          <button
                            onClick={() => approveClient(client.id, 12)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-2xs transition-colors"
                            title="Approve for 1 Year"
                          >
                            Approve (1 Year)
                          </button>
                        )}

                        {/* 6 Months Approval */}
                        {isPending && (
                          <button
                            onClick={() => approveClient(client.id, 6)}
                            className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-2xs transition-colors"
                            title="Approve for 6 Months"
                          >
                            6 Months
                          </button>
                        )}

                        {/* Suspend Action */}
                        {!isSuspended && (
                          <button
                            onClick={() => suspendClient(client.id)}
                            className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] border border-rose-200 transition-colors"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

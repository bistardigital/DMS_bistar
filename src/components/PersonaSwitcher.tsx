import React, { useState } from 'react';
import { useDms } from '../context/DmsContext.tsx';
import { ShieldCheck, UserCheck, Clock, UserX, ChevronDown, Check, Sparkles } from 'lucide-react';

export const PersonaSwitcher: React.FC = () => {
  const { currentUser, users, setCurrentUser } = useDms();
  const [isOpen, setIsOpen] = useState(false);

  const getPersonaBadge = () => {
    if (!currentUser) {
      return {
        label: 'Guest Visitor (Unregistered)',
        sub: 'Prices Locked',
        color: 'bg-slate-100 text-slate-700 border-slate-300',
        icon: UserX
      };
    }
    if (currentUser.role === 'SUPER_ADMIN') {
      return {
        label: 'Super Admin / Dealer',
        sub: currentUser.ownerName,
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: ShieldCheck
      };
    }
    if (currentUser.status === 'APPROVED') {
      return {
        label: 'Approved B2B Client',
        sub: currentUser.shopName || currentUser.ownerName,
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: UserCheck
      };
    }
    if (currentUser.status === 'PENDING') {
      return {
        label: 'Pending B2B Client',
        sub: currentUser.shopName || currentUser.ownerName,
        color: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: Clock
      };
    }
    return {
      label: 'Suspended Client',
      sub: currentUser.shopName || currentUser.ownerName,
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: UserX
    };
  };

  const badge = getPersonaBadge();
  const Icon = badge.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-xs hover:shadow-sm ${badge.color}`}
        aria-label="Switch User Persona"
        title="Switch active user role for testing"
      >
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <div className="text-left hidden sm:block">
          <div className="font-semibold leading-tight">{badge.label}</div>
          <div className="text-[10px] opacity-80 leading-tight truncate max-w-[140px]">{badge.sub}</div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 py-2.5 text-slate-800 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 pb-2 mb-1.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Instant Persona Switcher
            </span>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Demo RBAC
            </span>
          </div>

          <div className="space-y-1">
            {users.map(u => {
              const isSelected = currentUser?.id === u.id;
              const isSuper = u.role === 'SUPER_ADMIN';
              const isApprv = u.status === 'APPROVED';
              const isPend = u.status === 'PENDING';

              return (
                <button
                  key={u.id}
                  onClick={() => {
                    setCurrentUser(u);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-slate-100 font-semibold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-medium">
                        {isSuper ? '👑 ' : ''}{u.shopName || u.ownerName}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase font-bold shrink-0 ${
                          isSuper
                            ? 'bg-purple-100 text-purple-700'
                            : isApprv
                            ? 'bg-emerald-100 text-emerald-700'
                            : isPend
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isSuper ? 'Super Admin' : u.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {u.ownerName} • {u.phone}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                </button>
              );
            })}

            {/* Guest Option */}
            <button
              onClick={() => {
                setCurrentUser(null);
                setIsOpen(false);
              }}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors border-t border-slate-100 mt-1 pt-1.5 ${
                !currentUser ? 'bg-slate-100 font-semibold text-slate-900' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div>
                <div className="font-medium">Unregistered Guest (Public Visitor)</div>
                <div className="text-[10px] text-slate-400">Wholesale prices & Add to Cart locked</div>
              </div>
              {!currentUser && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

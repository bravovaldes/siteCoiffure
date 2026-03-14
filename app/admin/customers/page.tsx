'use client';

import { useState } from 'react';
import { useCustomers, useCustomerBookings } from '@/features/customers/hooks/useCustomers';
import { Customer, Booking } from '@/shared/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Users, X, Phone, Mail, Award, CalendarDays } from 'lucide-react';

const TIER: Record<string, { label: string; bg: string; text: string }> = {
  bronze: { label: 'Bronze', bg: 'bg-orange-50', text: 'text-orange-700' },
  silver: { label: 'Argent', bg: 'bg-gray-100', text: 'text-gray-600' },
  gold: { label: 'Or', bg: 'bg-amber-50', text: 'text-amber-700' },
  platinum: { label: 'Platine', bg: 'bg-purple-50', text: 'text-purple-700' },
};

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);
  const { data: customers = [], isLoading } = useCustomers(search);
  const { data: bookings = [] } = useCustomerBookings(selected?.id ?? null);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h1>
        <p className="text-sm text-gray-500 mt-0.5">{customers.length} client{customers.length > 1 ? 's' : ''}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, téléphone ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 border-0"
        />
      </div>

      <div className="rounded-xl bg-white overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Users size={40} strokeWidth={1.2} />
            <p className="mt-3 font-medium">Aucun client trouvé</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/70">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Visites</th>
                    <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Points</th>
                    <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Dernière visite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customers.map((c) => {
                    const t = TIER[c.tier];
                    return (
                      <tr key={c.id} onClick={() => setSelected(c)} className="hover:bg-gray-50/50 cursor-pointer transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-[11px] font-bold text-amber-700">
                              {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{c.name}</p>
                              <p className="text-[11px] text-gray-400">Depuis {format(new Date(c.firstVisit), 'MMM yyyy', { locale: fr })}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-sm text-gray-900">{c.phone}</p>
                          {c.email && <p className="text-[11px] text-gray-400">{c.email}</p>}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="text-sm font-semibold text-gray-900">{c.completedBookings}</span>
                          <span className="text-[11px] text-gray-400">/{c.totalBookings}</span>
                        </td>
                        <td className="px-5 py-3.5 text-center text-sm font-medium text-gray-900">{c.loyaltyPoints}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${t.bg} ${t.text}`}>{t.label}</span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-500">
                          {c.lastVisit ? format(new Date(c.lastVisit), 'd MMM yyyy', { locale: fr }) : '–'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-gray-50">
              {customers.map((c) => {
                const t = TIER[c.tier];
                return (
                  <div key={c.id} onClick={() => setSelected(c)} className="p-4 hover:bg-gray-50/50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-[11px] font-bold text-amber-700">
                          {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{c.name}</p>
                          <p className="text-[11px] text-gray-400">{c.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${t.bg} ${t.text}`}>{t.label}</span>
                        <p className="text-[11px] text-gray-400 mt-1">{c.loyaltyPoints} pts</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-sm font-bold text-amber-700">
                  {selected.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">{selected.name}</h2>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${TIER[selected.tier].bg} ${TIER[selected.tier].text}`}>
                    {TIER[selected.tier].label}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-md hover:bg-gray-100">
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone size={14} className="text-gray-400" /> {selected.phone}
                </div>
                {selected.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail size={14} className="text-gray-400" /> {selected.email}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Award size={14} className="text-gray-400" /> {selected.loyaltyPoints} points
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CalendarDays size={14} className="text-gray-400" /> {selected.completedBookings} visites
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-gray-50">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{selected.totalBookings}</p>
                  <p className="text-[11px] text-gray-500">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-emerald-600">{selected.completedBookings}</p>
                  <p className="text-[11px] text-gray-500">Complétés</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-red-500">{selected.cancelledBookings}</p>
                  <p className="text-[11px] text-gray-500">Annulés</p>
                </div>
              </div>

              <div>
                <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Historique</h3>
                {bookings.length === 0 ? (
                  <p className="text-sm text-gray-400">Aucune réservation</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {bookings.map((b: Booking) => (
                      <div key={b.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{b.serviceName}</p>
                          <p className="text-[11px] text-gray-500">{format(new Date(b.date), 'd MMM yyyy', { locale: fr })} – {b.startTime}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">{b.servicePrice} $</p>
                          <span className={`text-[11px] ${
                            b.status === 'completed' ? 'text-emerald-600' :
                            b.status === 'cancelled' ? 'text-red-500' :
                            b.status === 'confirmed' ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {b.status === 'completed' ? 'Complété' :
                             b.status === 'cancelled' ? 'Annulé' :
                             b.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

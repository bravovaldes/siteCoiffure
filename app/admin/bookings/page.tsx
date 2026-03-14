'use client';

import { useState, useMemo } from 'react';
import { useBookings, useUpdateBookingStatus, useDeleteBooking } from '@/features/bookings/hooks/useBookings';
import { BookingStatus, Booking } from '@/shared/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import {
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from 'lucide-react';

const FILTERS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmé' },
  { value: 'completed', label: 'Complété' },
  { value: 'cancelled', label: 'Annulé' },
];

const BADGE: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En attente' },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Confirmé' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Complété' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', label: 'Annulé' },
  no_show: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'No-show' },
};

const PER_PAGE = 20;

export default function BookingsPage() {
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const { data: bookings = [], isLoading } = useBookings({ status: filter, search });
  const updateStatus = useUpdateBookingStatus();
  const deleteMut = useDeleteBooking();

  const totalPages = Math.ceil(bookings.length / PER_PAGE);
  const rows = useMemo(() => {
    const s = (page - 1) * PER_PAGE;
    return bookings.slice(s, s + PER_PAGE);
  }, [bookings, page]);

  function act(id: string, status: BookingStatus, reason?: string) {
    updateStatus.mutate({ id, status, reason });
    setMenuId(null);
    setCancelTarget(null);
    setCancelReason('');
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Réservations</h1>
          <p className="text-sm text-gray-500 mt-0.5">{bookings.length} au total</p>
        </div>
        <Link
          href="/admin/bookings/new"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
        >
          <Plus size={16} /> Nouvelle réservation
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 border-0"
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-white p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setFilter(f.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === f.value
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <CalendarDays size={40} strokeWidth={1.2} />
            <p className="mt-3 font-medium">Aucune réservation</p>
            <p className="text-sm mt-1">Ajustez vos filtres ou créez-en une</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/70">
                    {['Client', 'Service', 'Date', 'Statut', 'Montant', ''].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rows.map((b) => {
                    const badge = BADGE[b.status];
                    return (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-600">
                              {b.customerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{b.customerName}</p>
                              <p className="text-[11px] text-gray-400">{b.customerPhone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">{b.serviceName}</td>
                        <td className="px-5 py-3">
                          <p className="text-sm text-gray-900">{format(new Date(b.date), 'd MMM yyyy', { locale: fr })}</p>
                          <p className="text-[11px] text-gray-400">{b.startTime} – {b.endTime}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${badge.bg} ${badge.text}`}>{badge.label}</span>
                        </td>
                        <td className="px-5 py-3 text-sm font-semibold text-gray-900">{b.servicePrice} $</td>
                        <td className="px-5 py-3 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={() => setMenuId(menuId === b.id ? null : b.id)}
                              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400"
                            >
                              <MoreHorizontal size={16} />
                            </button>
                            {menuId === b.id && (
                              <div className="absolute right-0 top-full mt-1 w-40 rounded-lg bg-white shadow-lg ring-1 ring-gray-100 py-1 z-50">
                                {b.status === 'pending' && (
                                  <Act icon={<CheckCircle2 size={14} />} label="Confirmer" onClick={() => act(b.id, 'confirmed')} cls="text-blue-600" />
                                )}
                                {['pending', 'confirmed'].includes(b.status) && (
                                  <Act icon={<CheckCircle2 size={14} />} label="Compléter" onClick={() => act(b.id, 'completed')} cls="text-emerald-600" />
                                )}
                                {!['cancelled', 'completed'].includes(b.status) && (
                                  <Act icon={<XCircle size={14} />} label="Annuler" onClick={() => { setCancelTarget(b); setMenuId(null); }} cls="text-red-600" />
                                )}
                                {['pending', 'confirmed'].includes(b.status) && (
                                  <Act icon={<Eye size={14} />} label="No-show" onClick={() => act(b.id, 'no_show')} cls="text-gray-600" />
                                )}
                                <div className="my-1 border-t border-gray-50" />
                                <Act icon={<Trash2 size={14} />} label="Supprimer" onClick={() => { if (confirm('Supprimer ?')) deleteMut.mutate(b.id); setMenuId(null); }} cls="text-red-500" />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-gray-50">
              {rows.map((b) => {
                const badge = BADGE[b.status];
                return (
                  <div key={b.id} className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-600">
                          {b.customerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{b.customerName}</p>
                          <p className="text-[11px] text-gray-400">{b.customerPhone}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${badge.bg} ${badge.text}`}>{badge.label}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-gray-700">{b.serviceName}</p>
                        <p className="text-[11px] text-gray-400">{format(new Date(b.date), 'd MMM', { locale: fr })} · {b.startTime}</p>
                      </div>
                      <p className="font-semibold text-gray-900">{b.servicePrice} $</p>
                    </div>
                    <div className="flex gap-2 pt-1">
                      {b.status === 'pending' && (
                        <button onClick={() => act(b.id, 'confirmed')} className="flex-1 py-2 rounded-md text-[11px] font-medium text-white bg-blue-500 hover:bg-blue-600">Confirmer</button>
                      )}
                      {['pending', 'confirmed'].includes(b.status) && (
                        <button onClick={() => act(b.id, 'completed')} className="flex-1 py-2 rounded-md text-[11px] font-medium text-white bg-emerald-500 hover:bg-emerald-600">Compléter</button>
                      )}
                      {!['cancelled', 'completed'].includes(b.status) && (
                        <button onClick={() => setCancelTarget(b)} className="flex-1 py-2 rounded-md text-[11px] font-medium text-red-600 bg-red-50 hover:bg-red-100">Annuler</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50/50">
            <p className="text-[11px] text-gray-500">Page {page}/{totalPages}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-md bg-white hover:bg-gray-50 disabled:opacity-40"><ChevronLeft size={14} /></button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-md bg-white hover:bg-gray-50 disabled:opacity-40"><ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Annuler la réservation</h3>
            <p className="text-sm text-gray-500">{cancelTarget.customerName} · {cancelTarget.serviceName}</p>
            <textarea
              placeholder="Raison (optionnel)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="w-full rounded-lg bg-gray-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setCancelTarget(null); setCancelReason(''); }} className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100">Retour</button>
              <button onClick={() => act(cancelTarget.id, 'cancelled', cancelReason)} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {menuId && <div className="fixed inset-0 z-40" onClick={() => setMenuId(null)} />}
    </div>
  );
}

function Act({ icon, label, onClick, cls }: { icon: React.ReactNode; label: string; onClick: () => void; cls: string }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-gray-50 ${cls}`}>{icon}{label}</button>
  );
}

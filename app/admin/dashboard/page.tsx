'use client';

import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats';
import { useUpdateBookingStatus } from '@/features/bookings/hooks/useBookings';
import { Booking } from '@/shared/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import {
  CalendarDays,
  TrendingUp,
  Wallet,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Scissors,
} from 'lucide-react';

const STATUS_DOT: Record<string, string> = {
  pending: 'bg-amber-400',
  confirmed: 'bg-blue-400',
  completed: 'bg-emerald-400',
  cancelled: 'bg-red-400',
  no_show: 'bg-gray-400',
};
const STATUS_LABEL: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  completed: 'Complété',
  cancelled: 'Annulé',
  no_show: 'No-show',
};

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const updateStatus = useUpdateBookingStatus();

  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-7 w-48 bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 h-72 bg-white rounded-xl" />
          <div className="h-72 bg-white rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const pending = stats.recentBookings.filter((b) => b.status === 'pending');

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
        </p>
      </div>

      {/* ─── Stat cards ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          icon={<CalendarDays size={20} />}
          color="blue"
          title="Aujourd'hui"
          value={stats.todayBookings}
          sub={`${stats.todayRevenue.toFixed(0)} $`}
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          color="green"
          title="Cette semaine"
          value={stats.weekBookings}
          sub={`${stats.weekRevenue.toFixed(0)} $`}
        />
        <StatCard
          icon={<Wallet size={20} />}
          color="orange"
          title="Ce mois"
          value={stats.monthBookings}
          sub={`${stats.monthRevenue.toFixed(0)} $`}
        />
        <StatCard
          icon={<Clock size={20} />}
          color="red"
          title="En attente"
          value={stats.pendingBookings}
        />
        <StatCard
          icon={<Users size={20} />}
          color="gray"
          title="Clients"
          value={stats.totalCustomers}
        />
        <StatCard
          icon={<Scissors size={20} />}
          color="green"
          title="Services"
          value={stats.activeServices}
          sub="actifs"
        />
      </div>

      {/* ─── Pending actions ─── */}
      {pending.length > 0 && (
        <div className="rounded-xl bg-amber-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                <Clock size={14} className="text-amber-600" />
              </div>
              <h2 className="text-sm font-semibold text-amber-900">
                {pending.length} en attente
              </h2>
            </div>
            <Link
              href="/admin/bookings?status=pending"
              className="text-xs font-medium text-amber-700 hover:text-amber-900 flex items-center gap-0.5"
            >
              Tout voir <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {pending.slice(0, 3).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-lg bg-white p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-700">
                    {b.customerName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{b.customerName}</p>
                    <p className="text-[11px] text-gray-500">
                      {b.serviceName} · {format(new Date(b.date), 'd MMM', { locale: fr })} {b.startTime}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5 ml-3 shrink-0">
                  <button
                    onClick={() => updateStatus.mutate({ id: b.id, status: 'confirmed' })}
                    className="flex items-center gap-1 rounded-md bg-emerald-500 px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-emerald-600 transition-colors"
                  >
                    <CheckCircle2 size={12} /> Confirmer
                  </button>
                  <button
                    onClick={() => updateStatus.mutate({ id: b.id, status: 'cancelled' })}
                    className="flex items-center gap-1 rounded-md bg-white border border-gray-200 px-2.5 py-1.5 text-[11px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <XCircle size={12} /> Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Main grid ─── */}
      <div className="grid gap-3 lg:grid-cols-3">
        {/* Recent bookings (spans 2) */}
        <div className="lg:col-span-2 rounded-xl bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Dernières réservations</h2>
            <Link
              href="/admin/bookings"
              className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
            >
              Voir tout <ArrowUpRight size={12} />
            </Link>
          </div>
          {stats.recentBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">Aucune réservation</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {stats.recentBookings.slice(0, 6).map((b) => (
                <BookingRow key={b.id} b={b} />
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-3">
          {/* Services populaires */}
          <div className="rounded-xl bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Services populaires</h2>
              <Link href="/admin/services" className="text-xs font-medium text-blue-600 hover:text-blue-800">
                Gérer
              </Link>
            </div>
            {stats.popularServices.length === 0 ? (
              <p className="text-sm text-gray-400">Aucune donnée</p>
            ) : (
              <div className="space-y-3">
                {stats.popularServices.slice(0, 5).map((s) => {
                  const max = stats.popularServices[0]?.count || 1;
                  const pct = Math.round((s.count / max) * 100);
                  return (
                    <div key={s.serviceId}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-medium text-gray-700">{s.serviceName}</span>
                        <span className="text-[11px] text-gray-500">{s.count} rdv · {s.revenue.toFixed(0)} $</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-amber-400 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top clients */}
          <div className="rounded-xl bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Meilleurs clients</h2>
              <Link href="/admin/customers" className="text-xs font-medium text-blue-600 hover:text-blue-800">
                Voir tout
              </Link>
            </div>
            {stats.topCustomers.length === 0 ? (
              <p className="text-sm text-gray-400">Aucune donnée</p>
            ) : (
              <div className="space-y-2.5">
                {stats.topCustomers.slice(0, 4).map((c) => (
                  <div key={c.customerId} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-600">
                      {c.customerName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-800 truncate">{c.customerName}</p>
                    </div>
                    <span className="text-[11px] text-gray-500 shrink-0">
                      {c.totalBookings} rdv · {c.totalSpent.toFixed(0)} $
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Monthly stats */}
          <div className="rounded-xl bg-white p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Statuts du mois</h2>
            <div className="space-y-2">
              <MiniBar label="Complétées" value={stats.completedBookings} total={stats.monthBookings} color="bg-emerald-400" />
              <MiniBar label="En attente" value={stats.pendingBookings} total={stats.monthBookings} color="bg-amber-400" />
              <MiniBar label="Annulées" value={stats.cancelledBookings} total={stats.monthBookings} color="bg-red-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Sub-components ─────────── */

const COLORS: Record<string, { bg: string; icon: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
  green: { bg: 'bg-green-50', icon: 'text-green-600' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
  red: { bg: 'bg-red-50', icon: 'text-red-600' },
  gray: { bg: 'bg-gray-100', icon: 'text-gray-600' },
};

function StatCard({
  icon,
  color,
  title,
  value,
  sub,
}: {
  icon: React.ReactNode;
  color: keyof typeof COLORS;
  title: string;
  value: number;
  sub?: string;
}) {
  const c = COLORS[color];
  return (
    <div className="rounded-xl bg-white p-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.bg}`}>
          <span className={c.icon}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

function BookingRow({ b }: { b: Booking }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-600">
          {b.customerName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-gray-900 truncate">{b.customerName}</p>
          <p className="text-[11px] text-gray-500 truncate">
            {b.serviceName} · {format(new Date(b.date), 'd MMM', { locale: fr })} {b.startTime}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 ml-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[b.status]}`} />
          <span className="text-[11px] text-gray-500">{STATUS_LABEL[b.status]}</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">{b.servicePrice} $</span>
      </div>
    </div>
  );
}

function MiniBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100">
        <div className={`h-1.5 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

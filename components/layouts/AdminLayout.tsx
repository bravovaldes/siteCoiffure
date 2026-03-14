'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  LayoutDashboard,
  CalendarDays,
  Scissors,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Réservations', href: '/admin/bookings', icon: CalendarDays },
  { label: 'Services', href: '/admin/services', icon: Scissors },
  { label: 'Clients', href: '/admin/customers', icon: Users },
  { label: 'Paramètres', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const initials = (user?.displayName || 'A')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Mobile overlay ─── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-white border-r border-gray-100 transition-transform duration-200 lg:translate-x-0 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500">
              <Scissors className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-900 leading-none">Issouf Coiffure</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Administration</p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  active
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`h-[18px] w-[18px] ${
                    active ? 'text-amber-600' : 'text-gray-400'
                  }`}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 truncate">
                {user?.displayName || 'Admin'}
              </p>
              <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main area ─── */}
      <div className="lg:pl-60">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-14 items-center bg-white border-b border-gray-100 px-4 lg:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <div className="ml-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500">
              <Scissors className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-gray-900">Issouf Coiffure</span>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/layouts/AdminLayout';
import AuthGuard from '@/features/auth/components/AuthGuard';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Ne pas protéger la page de login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Protéger toutes les autres routes admin
  return (
    <AuthGuard>
      <AdminLayout>{children}</AdminLayout>
    </AuthGuard>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

/**
 * Hook pour protéger les routes qui nécessitent une authentification
 * Redirige vers /admin/login si l'utilisateur n'est pas connecté
 *
 * @example
 * function AdminDashboard() {
 *   const { user, loading } = useRequireAuth();
 *
 *   if (loading) {
 *     return <LoadingSpinner />;
 *   }
 *
 *   return <div>Bienvenue {user.displayName}</div>;
 * }
 */
export function useRequireAuth() {
  const { user, loading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Attendre que l'authentification soit initialisée
    if (!initialized) {
      return;
    }

    // Si pas de chargement et pas d'utilisateur, rediriger vers login
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, initialized, router]);

  return { user, loading };
}

'use client';

import { useRequireAuth } from '../hooks/useRequireAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Composant pour protéger les routes admin
 * Affiche un loading pendant la vérification
 * Redirige vers /admin/login si non authentifié
 *
 * @example
 * <AuthGuard>
 *   <AdminDashboard />
 * </AuthGuard>
 */
export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useRequireAuth();

  // Afficher le fallback ou un loading pendant la vérification
  if (loading || !user) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Vérification de l'authentification...</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

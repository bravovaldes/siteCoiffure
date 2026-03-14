'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * Hook pour accéder à l'état et aux actions d'authentification
 * Initialise automatiquement l'authentification au premier appel
 *
 * @example
 * const { user, loading, signIn, signOut } = useAuth();
 *
 * // Connexion
 * await signIn({ email: 'admin@example.com', password: 'password' });
 *
 * // Déconnexion
 * await signOut();
 *
 * // Vérifier si l'utilisateur est connecté
 * if (user) {
 *   console.log(`Connecté en tant que ${user.email}`);
 * }
 */
export function useAuth() {
  const store = useAuthStore();
  const initializedRef = useRef(false);

  // Initialiser l'authentification au montage du composant (une seule fois)
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      console.log('🔐 Initializing authentication...');
      store.initialize();
    }
  }, [store]);

  return {
    user: store.user,
    loading: store.loading,
    error: store.error,
    initialized: store.initialized,
    signIn: store.signIn,
    signOut: store.signOut,
    isAuthenticated: !!store.user,
    isAdmin: store.user?.role === 'admin' || store.user?.role === 'super_admin',
    isSuperAdmin: store.user?.role === 'super_admin',
  };
}

'use client';

import { create } from 'zustand';
import { User, AuthState, LoginCredentials } from '@/shared/types/auth.types';
import { authService } from '../services/authService';

interface AuthStore extends AuthState {
  // Actions
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => void;
}

/**
 * Store Zustand pour l'authentification
 * Gère l'état global de l'authentification dans l'application
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  // État initial
  user: null,
  firebaseUser: null,
  loading: true,
  error: null,
  initialized: false,

  /**
   * Connexion utilisateur
   */
  signIn: async (credentials: LoginCredentials) => {
    try {
      set({ loading: true, error: null });
      const user = await authService.signIn(credentials);
      set({ user, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors de la connexion',
        loading: false
      });
      throw error;
    }
  },

  /**
   * Déconnexion utilisateur
   */
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await authService.signOut();
      set({ user: null, firebaseUser: null, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erreur lors de la déconnexion',
        loading: false
      });
      throw error;
    }
  },

  /**
   * Définir l'utilisateur
   */
  setUser: (user: User | null) => {
    set({ user, loading: false });
  },

  /**
   * Définir l'état de chargement
   */
  setLoading: (loading: boolean) => {
    set({ loading });
  },

  /**
   * Définir l'erreur
   */
  setError: (error: string | null) => {
    set({ error });
  },

  /**
   * Initialiser l'authentification
   * Écoute les changements d'état Firebase Auth
   */
  initialize: () => {
    if (get().initialized) {
      return;
    }

    set({ loading: true, initialized: true });

    // Timeout de sécurité : si Firebase ne répond pas en 5 secondes
    const timeout = setTimeout(() => {
      if (get().loading) {
        console.warn('Auth initialization timeout - setting loading to false');
        set({ loading: false, user: null });
      }
    }, 5000);

    // Écouter les changements d'état d'authentification
    try {
      const unsubscribe = authService.onAuthStateChanged((user) => {
        clearTimeout(timeout);
        set({ user, loading: false });
      });

      // Sauvegarder unsubscribe pour cleanup (si nécessaire)
      return unsubscribe;
    } catch (error) {
      console.error('Error initializing auth:', error);
      clearTimeout(timeout);
      set({ loading: false, user: null, error: 'Erreur d\'initialisation' });
    }
  },
}));

'use client';

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserRole, LoginCredentials, AuthError } from '@/shared/types/auth.types';

/**
 * Service d'authentification Firebase
 * Gère la connexion, déconnexion et récupération des données utilisateur
 */
class AuthService {
  /**
   * Connexion avec email et mot de passe
   */
  async signIn({ email, password }: LoginCredentials): Promise<User> {
    try {
      // Configurer la persistence (session locale)
      await setPersistence(auth, browserLocalPersistence);

      // Connexion Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Récupérer les données utilisateur depuis Firestore
      const user = await this.getUserData(firebaseUser.uid);

      if (!user) {
        throw new Error('Utilisateur non trouvé dans la base de données');
      }

      // Vérifier que c'est un admin
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        await this.signOut();
        throw new Error('Accès non autorisé. Seuls les administrateurs peuvent se connecter.');
      }

      // Mettre à jour la date de dernière connexion
      await this.updateLastLogin(user.uid);

      return user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Déconnexion
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Récupérer les données utilisateur depuis Firestore
   */
  async getUserData(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));

      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        uid,
        email: data.email,
        displayName: data.displayName,
        role: data.role as UserRole,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLogin: data.lastLogin?.toDate() || new Date(),
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  /**
   * Mettre à jour la date de dernière connexion
   */
  async updateLastLogin(uid: string): Promise<void> {
    try {
      await setDoc(
        doc(db, 'users', uid),
        { lastLogin: serverTimestamp() },
        { merge: true }
      );
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  /**
   * Écouter les changements d'état d'authentification
   */
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('🔐 Auth state changed:', firebaseUser ? `User ${firebaseUser.uid}` : 'No user');

      if (firebaseUser) {
        try {
          const user = await this.getUserData(firebaseUser.uid);

          if (!user) {
            console.warn('⚠️ User exists in Auth but not in Firestore');
            callback(null);
            return;
          }

          console.log('✅ User data loaded:', user.email, user.role);
          callback(user);
        } catch (error) {
          console.error('❌ Error loading user data:', error);
          callback(null);
        }
      } else {
        console.log('ℹ️ No user authenticated');
        callback(null);
      }
    });
  }

  /**
   * Gérer les erreurs Firebase Auth
   */
  private handleAuthError(error: any): AuthError {
    let message = 'Une erreur est survenue lors de l\'authentification';

    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Adresse email invalide';
        break;
      case 'auth/user-disabled':
        message = 'Ce compte a été désactivé';
        break;
      case 'auth/user-not-found':
        message = 'Aucun compte trouvé avec cet email';
        break;
      case 'auth/wrong-password':
        message = 'Mot de passe incorrect';
        break;
      case 'auth/invalid-credential':
        message = 'Identifiants invalides';
        break;
      case 'auth/too-many-requests':
        message = 'Trop de tentatives. Veuillez réessayer plus tard';
        break;
      case 'auth/network-request-failed':
        message = 'Erreur de connexion. Vérifiez votre connexion internet';
        break;
      default:
        message = error.message || message;
    }

    return {
      code: error.code || 'unknown',
      message,
    };
  }
}

export const authService = new AuthService();

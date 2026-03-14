'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Scissors } from 'lucide-react';
import LoginForm from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!loading && user) {
      router.push('/admin/dashboard');
    }
  }, [user, loading, router]);

  // Afficher un loading pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Ne pas afficher le formulaire si déjà connecté
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-gray-800 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4">
              <Scissors size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Espace Administrateur
            </h1>
            <p className="text-gray-300 text-sm">
              Issouf Coiffure
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <LoginForm />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Issouf Coiffure. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/useToast';

// Schéma de validation Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Adresse email invalide'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      await signIn(data);
      toast.success('Connexion réussie !', {
        description: 'Bienvenue dans l\'espace administrateur',
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast.error('Erreur de connexion', {
        description: error.message || 'Identifiants incorrects',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Adresse email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={18} className="text-gray-400" />
          </div>
          <input
            {...register('email')}
            type="email"
            id="email"
            className={`
              w-full pl-10 pr-4 py-3 border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
              transition-all
              ${errors.email ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="admin@issouf.com"
            disabled={isSubmitting}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-gray-400" />
          </div>
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            className={`
              w-full pl-10 pr-12 py-3 border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
              transition-all
              ${errors.password ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="••••••••"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={isSubmitting}
          >
            {showPassword ? (
              <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye size={18} className="text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full flex items-center justify-center gap-2 px-6 py-3
          bg-black text-white rounded-lg font-medium
          hover:bg-gray-800 active:bg-gray-900
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
          transition-all
          ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Connexion en cours...</span>
          </>
        ) : (
          <>
            <LogIn size={18} />
            <span>Se connecter</span>
          </>
        )}
      </button>

      {/* Info */}
      <p className="text-center text-sm text-gray-500">
        Accès réservé aux administrateurs uniquement
      </p>
    </form>
  );
}

'use client';

import { toast as sonnerToast } from 'sonner';

/**
 * Hook wrapper pour Sonner toast
 * Fournit une interface simplifiée et typée pour les notifications
 *
 * @example
 * const toast = useToast();
 *
 * toast.success('Réservation confirmée !');
 * toast.error('Une erreur est survenue');
 * toast.info('Nouvelle notification');
 * toast.warning('Attention !');
 */
export function useToast() {
  return {
    success: (message: string, options?: { description?: string; duration?: number }) => {
      sonnerToast.success(message, {
        description: options?.description,
        duration: options?.duration || 4000,
      });
    },
    error: (message: string, options?: { description?: string; duration?: number }) => {
      sonnerToast.error(message, {
        description: options?.description,
        duration: options?.duration || 5000,
      });
    },
    info: (message: string, options?: { description?: string; duration?: number }) => {
      sonnerToast.info(message, {
        description: options?.description,
        duration: options?.duration || 4000,
      });
    },
    warning: (message: string, options?: { description?: string; duration?: number }) => {
      sonnerToast.warning(message, {
        description: options?.description,
        duration: options?.duration || 4000,
      });
    },
    promise: <T,>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
      }
    ) => {
      return sonnerToast.promise(promise, messages);
    },
    dismiss: (toastId?: string | number) => {
      sonnerToast.dismiss(toastId);
    },
  };
}

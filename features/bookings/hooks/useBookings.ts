import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService, BookingFilters } from '../services/bookingService';
import { BookingStatus } from '@/shared/types';
import { toast } from 'sonner';

export function useBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => bookingService.getAll(filters),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookingService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Réservation créée');
    },
    onError: () => toast.error('Erreur lors de la création'),
  });
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: BookingStatus; reason?: string }) =>
      bookingService.updateStatus(id, status, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Statut mis à jour');
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  });
}

export function useDeleteBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookingService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Réservation supprimée');
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../services/serviceService';
import { Service } from '@/shared/types';
import { toast } from 'sonner';

export function useAdminServices() {
  return useQuery({
    queryKey: ['admin-services'],
    queryFn: () => serviceService.getAll(),
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Service, 'id' | 'createdAt'>) => serviceService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service créé');
    },
    onError: () => toast.error('Erreur lors de la création'),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Service, 'id' | 'createdAt'>> }) =>
      serviceService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service modifié');
    },
    onError: () => toast.error('Erreur lors de la modification'),
  });
}

export function useToggleServiceActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      serviceService.toggleActive(id, active),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Statut modifié');
    },
    onError: () => toast.error('Erreur'),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: serviceService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service supprimé');
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settingsService';
import { SalonSettings } from '@/shared/types';
import { toast } from 'sonner';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.get(),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SalonSettings>) => settingsService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Paramètres enregistrés');
    },
    onError: () => toast.error('Erreur lors de la sauvegarde'),
  });
}

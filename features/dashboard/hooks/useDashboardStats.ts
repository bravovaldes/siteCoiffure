'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    refetchInterval: 60000, // Refresh toutes les minutes
    staleTime: 30000, // Considérer les données obsolètes après 30 secondes
  });
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => dashboardService.getServices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => dashboardService.getBookings(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

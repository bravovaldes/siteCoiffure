import { useQuery } from '@tanstack/react-query';
import { customerService } from '../services/customerService';

export function useCustomers(search?: string) {
  return useQuery({
    queryKey: ['customers', search],
    queryFn: () => customerService.getAll(search),
  });
}

export function useCustomerBookings(customerId: string | null) {
  return useQuery({
    queryKey: ['customer-bookings', customerId],
    queryFn: () => customerService.getBookings(customerId!),
    enabled: !!customerId,
  });
}

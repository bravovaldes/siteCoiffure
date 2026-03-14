// Export all shared types
export * from './auth.types';

// Service types
export interface Service {
  id: string;
  name: string;
  duration: number; // en minutes
  price: number; // en dollars
  description: string;
  imageUrl?: string;
  active: boolean;
  order: number;
  createdAt: Date;
}

// Booking types
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: Date;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  cancellationReason?: string;
  cancelledAt?: Date;
  notes?: string;
  reminderSent: boolean;
  loyaltyPointsEarned?: number;
}

// Customer types
export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  loyaltyPoints: number;
  tier: LoyaltyTier;
  firstVisit: Date;
  lastVisit?: Date;
  createdAt: Date;
}

// Settings types
export interface SalonSettings {
  salonName: string;
  phone: string;
  whatsappNumber: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  hours: {
    monday: { open: string; close: string } | 'closed';
    tuesday: { open: string; close: string } | 'closed';
    wednesday: { open: string; close: string } | 'closed';
    thursday: { open: string; close: string } | 'closed';
    friday: { open: string; close: string } | 'closed';
    saturday: { open: string; close: string } | 'closed';
    sunday: { open: string; close: string } | 'closed';
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

// Dashboard Stats
export interface DashboardStats {
  todayBookings: number;
  weekBookings: number;
  monthBookings: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  totalCustomers: number;
  activeServices: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageBookingValue: number;
  popularServices: Array<{
    serviceId: string;
    serviceName: string;
    count: number;
    revenue: number;
  }>;
  recentBookings: Booking[];
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    totalSpent: number;
    totalBookings: number;
  }>;
}

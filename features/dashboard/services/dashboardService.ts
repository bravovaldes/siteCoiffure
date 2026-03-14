'use client';

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { convertFirestoreDocs } from '@/lib/firestore';
import { Booking, Service, Customer, DashboardStats } from '@/shared/types';
import { startOfDay, startOfWeek, startOfMonth, endOfDay } from 'date-fns';

class DashboardService {
  /**
   * Récupérer les statistiques du dashboard
   */
  async getStats(): Promise<DashboardStats> {
    const now = new Date();
    const todayStart = Timestamp.fromDate(startOfDay(now));
    const todayEnd = Timestamp.fromDate(endOfDay(now));
    const weekStart = Timestamp.fromDate(startOfWeek(now, { weekStartsOn: 1 }));
    const monthStart = Timestamp.fromDate(startOfMonth(now));

    // Récupérer toutes les réservations
    const bookingsRef = collection(db, 'bookings');

    // Réservations aujourd'hui
    const todayQuery = query(
      bookingsRef,
      where('date', '>=', todayStart),
      where('date', '<=', todayEnd)
    );
    const todayDocs = await getDocs(todayQuery);
    const todayBookings = convertFirestoreDocs<Booking>(todayDocs.docs);

    // Réservations cette semaine
    const weekQuery = query(bookingsRef, where('date', '>=', weekStart));
    const weekDocs = await getDocs(weekQuery);
    const weekBookings = convertFirestoreDocs<Booking>(weekDocs.docs);

    // Réservations ce mois
    const monthQuery = query(bookingsRef, where('date', '>=', monthStart));
    const monthDocs = await getDocs(monthQuery);
    const monthBookings = convertFirestoreDocs<Booking>(monthDocs.docs);

    // Calculer les revenus
    const todayRevenue = todayBookings
      .filter((b) => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + b.servicePrice, 0);

    const weekRevenue = weekBookings
      .filter((b) => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + b.servicePrice, 0);

    const monthRevenue = monthBookings
      .filter((b) => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + b.servicePrice, 0);

    // Services populaires
    const serviceStats = new Map<string, { name: string; count: number; revenue: number }>();
    monthBookings.forEach((booking) => {
      if (booking.status === 'completed') {
        const current = serviceStats.get(booking.serviceId) || {
          name: booking.serviceName,
          count: 0,
          revenue: 0,
        };
        serviceStats.set(booking.serviceId, {
          name: booking.serviceName,
          count: current.count + 1,
          revenue: current.revenue + booking.servicePrice,
        });
      }
    });

    const popularServices = Array.from(serviceStats.entries())
      .map(([serviceId, stats]) => ({
        serviceId,
        serviceName: stats.name,
        count: stats.count,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Réservations récentes
    const recentQuery = query(
      bookingsRef,
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const recentDocs = await getDocs(recentQuery);
    const recentBookings = convertFirestoreDocs<Booking>(recentDocs.docs);

    // Top clients
    const customerStats = new Map<string, { name: string; spent: number; bookings: number }>();
    monthBookings.forEach((booking) => {
      if (booking.status === 'completed') {
        const current = customerStats.get(booking.customerId) || {
          name: booking.customerName,
          spent: 0,
          bookings: 0,
        };
        customerStats.set(booking.customerId, {
          name: booking.customerName,
          spent: current.spent + booking.servicePrice,
          bookings: current.bookings + 1,
        });
      }
    });

    const topCustomers = Array.from(customerStats.entries())
      .map(([customerId, stats]) => ({
        customerId,
        customerName: stats.name,
        totalSpent: stats.spent,
        totalBookings: stats.bookings,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    // Services actifs
    const servicesSnapshot = await getDocs(
      query(collection(db, 'services'), where('active', '==', true))
    );

    // Clients totaux
    const customersSnapshot = await getDocs(collection(db, 'customers'));

    // Statistiques par statut
    const pending = monthBookings.filter((b) => b.status === 'pending').length;
    const completed = monthBookings.filter((b) => b.status === 'completed').length;
    const cancelled = monthBookings.filter((b) => b.status === 'cancelled').length;

    return {
      todayBookings: todayBookings.length,
      weekBookings: weekBookings.length,
      monthBookings: monthBookings.length,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      totalCustomers: customersSnapshot.size,
      activeServices: servicesSnapshot.size,
      pendingBookings: pending,
      completedBookings: completed,
      cancelledBookings: cancelled,
      averageBookingValue: monthRevenue / (completed || 1),
      popularServices,
      recentBookings,
      topCustomers,
    };
  }

  /**
   * Récupérer tous les services
   */
  async getServices(): Promise<Service[]> {
    const servicesSnapshot = await getDocs(
      query(collection(db, 'services'), orderBy('order', 'asc'))
    );
    return convertFirestoreDocs<Service>(servicesSnapshot.docs);
  }

  /**
   * Récupérer toutes les réservations
   */
  async getBookings(): Promise<Booking[]> {
    const bookingsSnapshot = await getDocs(
      query(collection(db, 'bookings'), orderBy('date', 'desc'))
    );
    return convertFirestoreDocs<Booking>(bookingsSnapshot.docs);
  }
}

export const dashboardService = new DashboardService();

import { db } from '@/lib/firebase';
import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { convertFirestoreDocs } from '@/lib/firestore';
import { Booking, BookingStatus } from '@/shared/types';

export interface BookingFilters {
  status?: BookingStatus | 'all';
  search?: string;
}

export const bookingService = {
  async getAll(filters?: BookingFilters): Promise<Booking[]> {
    const q = query(collection(db, 'bookings'), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    let bookings = convertFirestoreDocs<Booking>(snap.docs);

    if (filters?.status && filters.status !== 'all') {
      bookings = bookings.filter((b) => b.status === filters.status);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      bookings = bookings.filter(
        (b) =>
          b.customerName.toLowerCase().includes(s) ||
          b.customerPhone.includes(s)
      );
    }
    return bookings;
  },

  async getById(id: string): Promise<Booking | null> {
    const snap = await getDoc(doc(db, 'bookings', id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Booking;
  },

  async create(data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'reminderSent'>) {
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) {
        cleaned[k] = v instanceof Date ? Timestamp.fromDate(v) : v;
      }
    }
    return addDoc(collection(db, 'bookings'), {
      ...cleaned,
      status: 'pending',
      reminderSent: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async updateStatus(id: string, status: BookingStatus, reason?: string) {
    const updates: Record<string, unknown> = { status, updatedAt: serverTimestamp() };
    if (status === 'cancelled' && reason) {
      updates.cancellationReason = reason;
      updates.cancelledAt = serverTimestamp();
    }
    await updateDoc(doc(db, 'bookings', id), updates);
  },

  async remove(id: string) {
    await deleteDoc(doc(db, 'bookings', id));
  },
};

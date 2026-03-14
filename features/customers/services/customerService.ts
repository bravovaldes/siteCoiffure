import { db } from '@/lib/firebase';
import {
  collection,
  query,
  getDocs,
  orderBy,
  where,
} from 'firebase/firestore';
import { convertFirestoreDocs } from '@/lib/firestore';
import { Customer, Booking } from '@/shared/types';

export const customerService = {
  async getAll(search?: string): Promise<Customer[]> {
    const q = query(collection(db, 'customers'), orderBy('name', 'asc'));
    const snap = await getDocs(q);
    let customers = convertFirestoreDocs<Customer>(snap.docs);

    if (search) {
      const s = search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.phone.includes(s) ||
          c.email?.toLowerCase().includes(s)
      );
    }
    return customers;
  },

  async getBookings(customerId: string): Promise<Booking[]> {
    const q = query(
      collection(db, 'bookings'),
      where('customerId', '==', customerId),
      orderBy('date', 'desc')
    );
    const snap = await getDocs(q);
    return convertFirestoreDocs<Booking>(snap.docs);
  },
};

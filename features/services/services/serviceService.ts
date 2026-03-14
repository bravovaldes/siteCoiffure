import { db } from '@/lib/firebase';
import {
  collection,
  query,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { convertFirestoreDocs } from '@/lib/firestore';
import { Service } from '@/shared/types';

export const serviceService = {
  async getAll(): Promise<Service[]> {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return convertFirestoreDocs<Service>(snap.docs);
  },

  async create(data: Omit<Service, 'id' | 'createdAt'>) {
    return addDoc(collection(db, 'services'), {
      ...data,
      createdAt: serverTimestamp(),
    });
  },

  async update(id: string, data: Partial<Omit<Service, 'id' | 'createdAt'>>) {
    await updateDoc(doc(db, 'services', id), data as Record<string, unknown>);
  },

  async toggleActive(id: string, active: boolean) {
    await updateDoc(doc(db, 'services', id), { active });
  },

  async remove(id: string) {
    await deleteDoc(doc(db, 'services', id));
  },
};

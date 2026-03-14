import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { SalonSettings } from '@/shared/types';

const DEFAULT_SETTINGS: SalonSettings = {
  salonName: 'Issouf Coiffure',
  phone: '',
  whatsappNumber: '',
  address: { street: '', city: '', postalCode: '' },
  hours: {
    monday: { open: '09:00', close: '18:00' },
    tuesday: { open: '09:00', close: '18:00' },
    wednesday: { open: '09:00', close: '18:00' },
    thursday: { open: '09:00', close: '18:00' },
    friday: { open: '09:00', close: '18:00' },
    saturday: { open: '09:00', close: '16:00' },
    sunday: 'closed',
  },
  socialMedia: {},
};

export const settingsService = {
  async get(): Promise<SalonSettings> {
    const snap = await getDoc(doc(db, 'settings', 'general'));
    if (!snap.exists()) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...snap.data() } as SalonSettings;
  },

  async update(data: Partial<SalonSettings>): Promise<void> {
    await setDoc(doc(db, 'settings', 'general'), data, { merge: true });
  },
};

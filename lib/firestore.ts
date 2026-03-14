/**
 * Firestore helper functions
 * Fonctions utilitaires pour convertir les données Firestore
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Convertir un Timestamp Firestore en Date
 */
export function timestampToDate(timestamp: any): Date {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (timestamp.toDate) return timestamp.toDate();
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  return new Date(timestamp);
}

/**
 * Convertir un document Firestore en objet typé
 */
export function convertFirestoreDoc<T>(doc: any): T {
  const data = doc.data();
  const converted: any = { id: doc.id };

  Object.keys(data).forEach((key) => {
    const value = data[key];

    // Convertir les Timestamps en Dates
    if (value instanceof Timestamp) {
      converted[key] = value.toDate();
    } else if (value?.seconds !== undefined) {
      converted[key] = new Date(value.seconds * 1000);
    } else {
      converted[key] = value;
    }
  });

  return converted as T;
}

/**
 * Convertir un tableau de documents Firestore
 */
export function convertFirestoreDocs<T>(docs: any[]): T[] {
  return docs.map((doc) => convertFirestoreDoc<T>(doc));
}

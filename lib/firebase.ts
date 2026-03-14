import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCOzT4QWVR9VSSNYqjZV5Bd7mZBTWV3Uys",
  authDomain: "coiffure-3656c.firebaseapp.com",
  projectId: "coiffure-3656c",
  storageBucket: "coiffure-3656c.firebasestorage.app",
  messagingSenderId: "691429484941",
  appId: "1:691429484941:web:7d2bd301db54a33df435c4",
  measurementId: "G-9XTE0DTR87"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (only in browser)
let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };

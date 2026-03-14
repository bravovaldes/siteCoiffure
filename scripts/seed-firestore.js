/**
 * Script pour peupler Firestore avec des données de test
 * Usage: node scripts/seed-firestore.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, serverTimestamp, Timestamp } = require('firebase/firestore');

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCOzT4QWVR9VSSNYqjZV5Bd7mZBTWV3Uys",
  authDomain: "coiffure-3656c.firebaseapp.com",
  projectId: "coiffure-3656c",
  storageBucket: "coiffure-3656c.firebasestorage.app",
  messagingSenderId: "691429484941",
  appId: "1:691429484941:web:7d2bd301db54a33df435c4",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Données de test
const services = [
  {
    id: 'service-1',
    name: 'Coupe Homme',
    duration: 30,
    price: 25,
    description: 'Coupe classique pour homme avec finitions soignées',
    active: true,
    order: 1,
  },
  {
    id: 'service-2',
    name: 'Coupe + Barbe',
    duration: 45,
    price: 40,
    description: 'Coupe complète avec taille et entretien de barbe',
    active: true,
    order: 2,
  },
  {
    id: 'service-3',
    name: 'Coupe Enfant',
    duration: 20,
    price: 18,
    description: 'Coupe adaptée pour les enfants (-12 ans)',
    active: true,
    order: 3,
  },
  {
    id: 'service-4',
    name: 'Coupe Femme',
    duration: 60,
    price: 45,
    description: 'Coupe et coiffage pour femme',
    active: true,
    order: 4,
  },
  {
    id: 'service-5',
    name: 'Coloration',
    duration: 90,
    price: 80,
    description: 'Coloration complète avec soin',
    active: true,
    order: 5,
  },
];

const customers = [
  {
    id: 'customer-1',
    name: 'Jean Tremblay',
    phone: '+14185551234',
    email: 'jean.tremblay@example.com',
    totalBookings: 12,
    completedBookings: 10,
    cancelledBookings: 2,
    loyaltyPoints: 250,
    tier: 'silver',
    firstVisit: new Date('2024-01-15'),
    lastVisit: new Date('2025-02-01'),
  },
  {
    id: 'customer-2',
    name: 'Marie Gagnon',
    phone: '+14185555678',
    email: 'marie.gagnon@example.com',
    totalBookings: 25,
    completedBookings: 23,
    cancelledBookings: 2,
    loyaltyPoints: 575,
    tier: 'gold',
    firstVisit: new Date('2023-06-10'),
    lastVisit: new Date('2025-02-10'),
  },
  {
    id: 'customer-3',
    name: 'Pierre Bouchard',
    phone: '+14185559012',
    totalBookings: 5,
    completedBookings: 5,
    cancelledBookings: 0,
    loyaltyPoints: 125,
    tier: 'bronze',
    firstVisit: new Date('2024-11-20'),
    lastVisit: new Date('2025-01-25'),
  },
];

// Générer des réservations pour aujourd'hui, cette semaine et ce mois
const generateBookings = () => {
  const bookings = [];
  const today = new Date();
  const statuses = ['confirmed', 'completed', 'pending'];

  // Réservations aujourd'hui
  for (let i = 0; i < 5; i++) {
    const service = services[i % services.length];
    const customer = customers[i % customers.length];
    const hour = 9 + i * 2;

    bookings.push({
      id: `booking-today-${i}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      date: today,
      startTime: `${hour}:00`,
      endTime: `${hour + Math.floor(service.duration / 60)}:${service.duration % 60 || '00'}`,
      status: statuses[i % statuses.length],
      reminderSent: false,
      notes: '',
    });
  }

  // Réservations cette semaine (passées)
  for (let i = 0; i < 15; i++) {
    const service = services[i % services.length];
    const customer = customers[i % customers.length];
    const daysAgo = Math.floor(Math.random() * 7) + 1;
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);

    bookings.push({
      id: `booking-week-${i}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      date: date,
      startTime: `${9 + (i % 8)}:00`,
      endTime: `${10 + (i % 8)}:00`,
      status: 'completed',
      reminderSent: true,
      loyaltyPointsEarned: Math.floor(service.price),
    });
  }

  // Réservations ce mois (passées)
  for (let i = 0; i < 30; i++) {
    const service = services[i % services.length];
    const customer = customers[i % customers.length];
    const daysAgo = Math.floor(Math.random() * 30) + 8;
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);

    bookings.push({
      id: `booking-month-${i}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      date: date,
      startTime: `${9 + (i % 8)}:00`,
      endTime: `${10 + (i % 8)}:00`,
      status: Math.random() > 0.1 ? 'completed' : 'cancelled',
      reminderSent: true,
      loyaltyPointsEarned: Math.random() > 0.1 ? Math.floor(service.price) : 0,
    });
  }

  return bookings;
};

const settings = {
  salonName: 'Issouf Coiffure',
  phone: '+1 (418) 555-0100',
  whatsappNumber: '+14185550100',
  address: {
    street: '55 rue Saint-Luc',
    city: 'Chicoutimi',
    postalCode: 'G7J 1A1',
  },
  hours: {
    monday: { open: '09:00', close: '18:00' },
    tuesday: { open: '09:00', close: '18:00' },
    wednesday: { open: '09:00', close: '18:00' },
    thursday: { open: '09:00', close: '20:00' },
    friday: { open: '09:00', close: '20:00' },
    saturday: { open: '09:00', close: '17:00' },
    sunday: 'closed',
  },
  socialMedia: {
    facebook: 'https://facebook.com/issoufcoiffure',
    instagram: 'https://instagram.com/issoufcoiffure',
  },
};

async function seedFirestore() {
  try {
    console.log('🌱 Starting Firestore seeding...\n');

    // 1. Ajouter les services
    console.log('📦 Adding services...');
    for (const service of services) {
      await setDoc(doc(db, 'services', service.id), {
        ...service,
        createdAt: serverTimestamp(),
      });
      console.log(`  ✅ ${service.name}`);
    }

    // 2. Ajouter les clients
    console.log('\n👥 Adding customers...');
    for (const customer of customers) {
      await setDoc(doc(db, 'customers', customer.id), {
        ...customer,
        firstVisit: Timestamp.fromDate(customer.firstVisit),
        lastVisit: customer.lastVisit ? Timestamp.fromDate(customer.lastVisit) : null,
        createdAt: serverTimestamp(),
      });
      console.log(`  ✅ ${customer.name}`);
    }

    // 3. Ajouter les réservations
    console.log('\n📅 Adding bookings...');
    const bookings = generateBookings();
    for (const booking of bookings) {
      // Filtrer les valeurs undefined
      const bookingData = {
        ...booking,
        date: Timestamp.fromDate(booking.date),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Supprimer les champs undefined
      Object.keys(bookingData).forEach(key => {
        if (bookingData[key] === undefined) {
          delete bookingData[key];
        }
      });

      await setDoc(doc(db, 'bookings', booking.id), bookingData);
    }
    console.log(`  ✅ ${bookings.length} bookings added`);

    // 4. Ajouter les paramètres
    console.log('\n⚙️  Adding settings...');
    await setDoc(doc(db, 'settings', 'general'), settings);
    console.log('  ✅ General settings');

    console.log('\n🎉 Firestore seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - ${services.length} services`);
    console.log(`  - ${customers.length} customers`);
    console.log(`  - ${bookings.length} bookings`);
    console.log('  - 1 settings document');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding Firestore:', error);
    process.exit(1);
  }
}

// Exécuter le script
seedFirestore();

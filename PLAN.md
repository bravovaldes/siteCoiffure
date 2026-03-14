# Plan de Reconstruction Complète - Site Coiffure Issouf

## Contexte

Le projet SiteCoiffure actuel est une application React moderne avec un design soigné, mais présente des limitations critiques :
- ❌ Aucune intégration backend (données mockées en local)
- ❌ Dashboard admin non protégé et non fonctionnel
- ❌ Pas de persistance des données (tout est perdu au refresh)
- ❌ Pas d'authentification

**Objectif** : Reconstruire complètement le projet avec TypeScript, Firebase, et une architecture production-ready incluant :
- ✅ Dashboard admin complet et fonctionnel
- ✅ Interface client magnifique et responsive
- ✅ Système de notifications SMS/Email
- ✅ Programme de fidélité
- ✅ Architecture scalable et maintenable

**Décisions utilisateur** :
- Language : TypeScript (pour la sécurité des types)
- Priorité : Les deux équilibrés (admin + client)
- Fonctionnalités avancées : Notifications + Fidélité
- Approche : Refonte complète (nouveau projet)

---

## Architecture Technique

### Stack Technologique

**Frontend**
- React 19 + TypeScript
- Vite 6 (build tool)
- Tailwind CSS 3 + shadcn/ui
- React Router v7
- Zustand (state management client)
- TanStack Query v5 (server state)
- React Hook Form + Zod (validation)
- Sonner (notifications toast)
- React Helmet Async (SEO)

**Backend & Database**
- Firebase Authentication (admin login)
- Cloud Firestore (database)
- Firebase Storage (images)
- Firebase Cloud Functions (notifications, emails)

**Dev Tools**
- TypeScript
- ESLint + Prettier
- Vitest + React Testing Library
- Playwright (E2E tests)

### Structure du Projet

```
SiteCoiffure/
├── src/
│   ├── app/                      # Configuration app
│   │   ├── App.tsx
│   │   ├── Router.tsx
│   │   └── providers/            # QueryClient, AuthProvider
│   ├── features/                 # Organisation par fonctionnalité
│   │   ├── auth/
│   │   │   ├── components/       # LoginForm, AuthGuard
│   │   │   ├── hooks/            # useAuth, useRequireAuth
│   │   │   ├── services/         # authService.ts
│   │   │   └── store/            # authStore.ts (Zustand)
│   │   ├── booking/
│   │   │   ├── components/       # BookingWizard, SlotPicker, DateCalendar
│   │   │   ├── hooks/            # useAvailability, useCreateBooking
│   │   │   ├── services/         # bookingService.ts
│   │   │   ├── types/            # Booking.types.ts
│   │   │   └── utils/            # slotCalculation.ts
│   │   ├── admin/
│   │   │   ├── components/       # DashboardStats, BookingTable, etc.
│   │   │   ├── layouts/          # AdminLayout (avec sidebar)
│   │   │   ├── hooks/            # useBookings, useStats
│   │   │   └── pages/            # Dashboard, Availability, etc.
│   │   ├── services/
│   │   │   ├── components/       # ServiceCard, ServiceForm
│   │   │   └── hooks/            # useServices
│   │   ├── testimonials/
│   │   │   ├── components/       # TestimonialSlider, TestimonialForm
│   │   │   └── hooks/            # useTestimonials
│   │   └── loyalty/
│   │       ├── components/       # LoyaltyCard, PointsHistory
│   │       └── hooks/            # useCustomerPoints
│   ├── shared/                   # Composants partagés
│   │   ├── components/           # Button, Modal, Input, Card, Badge, etc.
│   │   ├── hooks/                # useMediaQuery, useDebounce, useToast
│   │   ├── lib/                  # Firebase config, utilities
│   │   └── types/                # Types globaux TypeScript
│   ├── pages/                    # Pages route
│   │   ├── HomePage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── BookingPage.tsx
│   │   ├── ConfirmationPage.tsx
│   │   └── admin/
│   └── assets/                   # Images, icônes
├── functions/                    # Firebase Cloud Functions
│   ├── src/
│   │   ├── notifications.ts      # Email/SMS triggers
│   │   └── loyalty.ts            # Points calculation
│   └── package.json
├── firestore.rules               # Security rules
├── firebase.json                 # Firebase config
├── .env.local                    # Variables d'environnement
└── package.json
```

---

## Structure Firestore

### Collections

```typescript
// users/ - Admins uniquement
{
  uid: string (doc ID)
  email: string
  role: 'admin' | 'super_admin'
  displayName: string
  createdAt: Timestamp
  lastLogin: Timestamp
}

// services/ - Services offerts
{
  id: string (auto)
  name: string                    // Ex: "Coupe Homme"
  duration: number                // En minutes
  price: number                   // Prix en $
  description: string
  imageUrl?: string               // URL Firebase Storage
  active: boolean
  order: number                   // Ordre d'affichage
  createdAt: Timestamp
}

// availabilityTemplates/ - Horaires récurrents
{
  id: string (auto)
  dayOfWeek: number               // 0 (dimanche) à 6 (samedi)
  startTime: string               // "09:00"
  endTime: string                 // "18:00"
  slotDuration: number            // 60 minutes par défaut
  isActive: boolean
}

// availabilityExceptions/ - Dates spéciales
{
  id: string (auto)
  date: Timestamp
  type: 'closed' | 'modified'
  customSlots?: Array<{startTime: string, endTime: string}>
  reason: string                  // Ex: "Congé férié"
}

// bookings/ - Réservations clients
{
  id: string (auto)
  customerId: string              // Numéro de téléphone ou UUID
  customerName: string
  customerPhone: string
  customerEmail?: string
  serviceId: string               // Référence à services/
  serviceName: string             // Dénormalisé pour performance
  servicePrice: number            // Prix au moment de la réservation
  date: Timestamp
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  createdAt: Timestamp
  updatedAt: Timestamp
  cancellationReason?: string
  cancelledAt?: Timestamp
  notes?: string
  reminderSent: boolean
  loyaltyPointsEarned?: number
}

// customers/ - Base de données clients
{
  id: string (phone or UUID)
  name: string
  phone: string
  email?: string
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  loyaltyPoints: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  firstVisit: Timestamp
  lastVisit?: Timestamp
  createdAt: Timestamp
}

// loyaltyTransactions/ - Historique des points
{
  id: string (auto)
  customerId: string
  bookingId?: string
  points: number                  // Positif = gagné, négatif = dépensé
  type: 'earned' | 'redeemed' | 'expired' | 'bonus'
  description: string
  createdAt: Timestamp
}

// testimonials/ - Avis clients
{
  id: string (auto)
  customerId?: string
  customerName: string
  city: string
  message: string
  rating: number                  // 1-5
  approved: boolean
  createdAt: Timestamp
  publishedAt?: Timestamp
  moderatedBy?: string            // Admin UID
}

// settings/ - Configuration salon
{
  general: {
    salonName: string
    phone: string
    whatsappNumber: string
    address: {
      street: string
      city: string
      postalCode: string
    }
    hours: {
      monday: {open: string, close: string}
      // ... autres jours
    }
    socialMedia: {
      facebook?: string
      instagram?: string
    }
  }
  booking: {
    slotDuration: number          // 60 minutes par défaut
    bufferTime: number            // 15 minutes entre rendez-vous
    maxAdvanceBookingDays: number // 30 jours
    cancellationHours: number     // 24 heures minimum
  }
  loyalty: {
    pointsPerDollar: number       // 1 point par $
    bronzeThreshold: number       // 0 points
    silverThreshold: number       // 100 points
    goldThreshold: number         // 500 points
    platinumThreshold: number     // 1000 points
    discounts: {
      bronze: number              // 0%
      silver: number              // 5%
      gold: number                // 10%
      platinum: number            // 15%
    }
  }
  notifications: {
    emailEnabled: boolean
    smsEnabled: boolean
    reminderHours: number         // 24 heures avant
    sendGridApiKey?: string
    twilioAccountSid?: string
    twilioAuthToken?: string
    twilioPhoneNumber?: string
  }
}
```

### Security Rules (firestore.rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }

    function isSuperAdmin() {
      return isSignedIn() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';
    }

    // Services: public read (active only), admin write
    match /services/{serviceId} {
      allow read: if resource.data.active == true;
      allow list: if isAdmin() ||
                     (request.query.limit <= 50 &&
                      resource.data.active == true);
      allow create, update, delete: if isAdmin();
    }

    // Availability: public read, admin write
    match /availabilityTemplates/{templateId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /availabilityExceptions/{exceptionId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Bookings: customers can create, admins can manage
    match /bookings/{bookingId} {
      allow create: if request.resource.data.customerPhone != null &&
                       request.resource.data.customerName != null &&
                       request.resource.data.serviceId != null;
      allow read: if isAdmin() ||
                     (isSignedIn() && resource.data.customerEmail == request.auth.token.email);
      allow update: if isAdmin() ||
                       (resource.data.customerPhone == request.resource.data.customerPhone &&
                        request.resource.data.status == 'cancelled');
      allow delete: if isAdmin();
      allow list: if isAdmin();
    }

    // Customers: admin read/write, customer read own
    match /customers/{customerId} {
      allow read: if isAdmin() ||
                     (isSignedIn() && customerId == request.auth.uid);
      allow create: if true; // Auto-created on first booking
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    // Loyalty transactions: admin write, customer read own
    match /loyaltyTransactions/{transactionId} {
      allow read: if isAdmin() ||
                     (isSignedIn() && resource.data.customerId == request.auth.uid);
      allow write: if isAdmin();
    }

    // Testimonials: create allowed, read approved only, admin manages
    match /testimonials/{testimonialId} {
      allow read: if resource.data.approved == true;
      allow list: if isAdmin() ||
                     (request.query.limit <= 20 &&
                      resource.data.approved == true);
      allow create: if request.resource.data.customerName != null &&
                       request.resource.data.message != null;
      allow update, delete: if isAdmin();
    }

    // Users (admins): super admin only
    match /users/{userId} {
      allow read: if isAdmin();
      allow write: if isSuperAdmin();
    }

    // Settings: public read, admin write
    match /settings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

---

## Fonctionnalités à Implémenter

### 🎨 Interface Client (Public)

#### 1. Page d'Accueil
**Composants à créer/migrer** :
- `HomePage.tsx` - Page principale
- `HeroSection.tsx` - Bannière avec ImageSlider (migrer de Navbar.jsx)
- `ServiceGrid.tsx` - Grille de services avec images
- `TestimonialCarousel.tsx` - Carrousel d'avis (migrer de Temoignages.jsx)
- `CTASection.tsx` - Call-to-action réservation
- `ContactSection.tsx` - Infos contact (migrer de AdresseSalon.jsx)

**Fonctionnalités** :
- Affichage dynamique des services depuis Firestore
- Carrousel d'images salon (réutiliser ImageSlider existant)
- Affichage des témoignages approuvés
- Section "Comment réserver" avec steps
- Map Google intégrée
- Bouton WhatsApp flottant (garder WhatsAppButton.jsx)

#### 2. Page Services
**Composants** :
- `ServicesPage.tsx`
- `ServiceCard.tsx` - Card avec image, prix, durée, description
- `ServiceModal.tsx` - Détails + bouton "Réserver"

**Fonctionnalités** :
- Liste tous les services actifs
- Filtrage par catégorie (optionnel)
- Affichage des prix et durées
- Lien direct vers réservation avec service pré-sélectionné

#### 3. Flow de Réservation (Multi-étapes)
**Composants** :
- `BookingPage.tsx` - Container principal
- `BookingWizard.tsx` - Stepper navigation
- `ServiceSelector.tsx` - Step 1: Choix du service
- `DateTimeSelector.tsx` - Step 2: Date + créneau horaire
  - `Calendar.tsx` - Calendrier avec dates disponibles
  - `SlotGrid.tsx` - Grille des créneaux disponibles
- `CustomerInfoForm.tsx` - Step 3: Infos client
- `BookingSummary.tsx` - Step 4: Récapitulatif
- `ConfirmationPage.tsx` - Page de confirmation

**Logique de disponibilité** :
```typescript
// src/features/booking/utils/slotCalculation.ts
/**
 * Calcule les créneaux disponibles pour une date donnée
 * @param date - Date sélectionnée
 * @param serviceDuration - Durée du service en minutes
 * @param existingBookings - Réservations existantes
 * @param template - Template horaire du jour
 * @param exceptions - Exceptions (congés, etc.)
 * @returns Array de slots avec statut (available/booked/blocked)
 */
function calculateAvailableSlots(
  date: Date,
  serviceDuration: number,
  existingBookings: Booking[],
  template: AvailabilityTemplate,
  exceptions: AvailabilityException[]
): TimeSlot[]
```

**Validation** :
- Zod schema pour le formulaire client
- Vérification temps réel de disponibilité (TanStack Query)
- Empêcher réservation dans le passé
- Respecter délai d'annulation (24h)

#### 4. Annulation de Réservation
**Composants** :
- `CancelBookingPage.tsx` - Page publique `/cancel/:bookingId`
- `CancelForm.tsx` - Formulaire avec vérification téléphone

**Fonctionnalités** :
- Vérification identité via numéro de téléphone
- Affichage détails réservation
- Formulaire motif d'annulation
- Mise à jour statut dans Firestore
- Email de confirmation d'annulation

#### 5. Programme de Fidélité (Client)
**Composants** :
- `LoyaltyCard.tsx` - Affichage points et tier
- `LoyaltyBenefits.tsx` - Avantages par tier
- `PointsHistory.tsx` - Historique des transactions

**Logique** :
- Affichage points après connexion (via téléphone)
- Calcul automatique points gagnés par réservation (Cloud Function)
- Affichage réductions applicables

#### 6. Témoignages
**Composants** :
- `TestimonialForm.tsx` - Formulaire soumission avis
- `TestimonialDisplay.tsx` - Affichage avis approuvés

**Fonctionnalités** :
- Soumission avis avec note 1-5 étoiles
- Validation Zod
- Modération admin avant publication

---

### 🛠️ Dashboard Admin

#### 1. Authentification Admin
**Composants** :
- `LoginPage.tsx` - Page login `/admin/login`
- `LoginForm.tsx` - Formulaire email/password
- `AuthGuard.tsx` - HOC pour protéger routes admin
- `AdminLayout.tsx` - Layout avec sidebar

**Hooks** :
```typescript
// src/features/auth/hooks/useAuth.ts
export function useAuth() {
  return useAuthStore((state) => ({
    user: state.user,
    loading: state.loading,
    signIn: state.signIn,
    signOut: state.signOut,
  }));
}

// src/features/auth/hooks/useRequireAuth.ts
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login', { replace: true });
    }
  }, [user, loading, navigate]);

  return { user, loading };
}
```

**Routes protégées** :
```typescript
<Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
  <Route index element={<Navigate to="/admin/dashboard" replace />} />
  <Route path="dashboard" element={<DashboardPage />} />
  <Route path="availability" element={<AvailabilityPage />} />
  <Route path="bookings" element={<BookingsPage />} />
  // ... autres routes
</Route>
```

#### 2. Dashboard Overview
**Composants** :
- `DashboardPage.tsx`
- `StatsCards.tsx` - Cards KPIs (revenus, réservations, etc.)
- `RevenueChart.tsx` - Graphique revenus (react-chartjs-2)
- `UpcomingBookings.tsx` - Liste 5 prochains RDV
- `RecentActivity.tsx` - Activité récente

**Métriques affichées** :
- Réservations aujourd'hui / cette semaine / ce mois
- Revenus période
- Taux d'annulation
- Clients fidèles (top 5)
- Services populaires
- Graphique évolution réservations (7 derniers jours)

**Queries TanStack** :
```typescript
// src/features/admin/hooks/useStats.ts
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const now = new Date();
      const startOfWeek = startOfWeekFn(now);

      const bookingsSnapshot = await getDocs(
        query(
          collection(db, 'bookings'),
          where('date', '>=', startOfWeek),
          where('status', 'in', ['confirmed', 'completed'])
        )
      );

      // Calculs statistiques...
      return {
        todayBookings: ...,
        weekRevenue: ...,
        // ...
      };
    },
    refetchInterval: 60000, // Refresh toutes les minutes
  });
}
```

#### 3. Gestion Disponibilités
**Composants** :
- `AvailabilityPage.tsx`
- `TemplateManager.tsx` - CRUD horaires récurrents
  - Formulaire ajout: Jour, Heure début/fin, Durée créneaux
  - Table avec actions Edit/Delete
- `ExceptionManager.tsx` - CRUD exceptions
  - Calendrier pour sélectionner date
  - Type: Fermé / Horaires modifiés
  - Motif
- `AvailabilityCalendar.tsx` - Vue calendrier globale

**Fonctionnalités** :
- Créer template par jour de semaine
- Modifier durée des créneaux (30min, 45min, 60min)
- Ajouter congés/vacances (exceptions)
- Modifier horaires spéciaux (jours fériés)
- Vue visuelle du calendrier avec disponibilités
- Bulk operations: "Fermer toute la semaine prochaine"

**Validations** :
- Empêcher chevauchement d'horaires
- Vérifier conflits avec réservations existantes
- Confirmation si modification impacte des RDV

#### 4. Gestion Réservations
**Composants** :
- `BookingsPage.tsx`
- `BookingTable.tsx` - Table avec filtres et actions
- `BookingFilters.tsx` - Filtres (date, statut, service)
- `BookingDetailsModal.tsx` - Modal détails + actions
- `BookingEditForm.tsx` - Formulaire modification

**Fonctionnalités** :
- Table responsive (mobile = cards)
- Colonnes : Client, Service, Date, Heure, Statut, Actions
- Filtres :
  - Par date (range picker)
  - Par statut (pending, confirmed, cancelled, completed, no_show)
  - Par service
  - Recherche client (nom, téléphone)
- Actions :
  - ✅ Confirmer
  - ✏️ Modifier (date, heure, service)
  - ❌ Annuler (avec raison)
  - ✔️ Marquer comme complété
  - 🚫 Marquer comme no-show
  - 📝 Ajouter notes internes
- Pagination (20 par page)
- Export CSV
- Statistiques en haut (total, aujourd'hui, cette semaine)

**Mutations TanStack** :
```typescript
// src/features/admin/hooks/useUpdateBooking.ts
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: BookingStatus }) => {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    },
    onMutate: async ({ bookingId, status }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['bookings'] });
      const previous = queryClient.getQueryData(['bookings']);

      queryClient.setQueryData(['bookings'], (old: Booking[]) =>
        old.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );

      return { previous };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['bookings'], context.previous);
      toast.error('Erreur lors de la mise à jour');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Réservation mise à jour');
    },
  });
}
```

#### 5. Gestion Services
**Composants** :
- `ServicesPage.tsx`
- `ServiceTable.tsx` - Table services
- `ServiceForm.tsx` - Formulaire CRUD
- `ImageUploader.tsx` - Upload image vers Firebase Storage

**Fonctionnalités** :
- Table : Nom, Durée, Prix, Statut (actif/inactif), Actions
- Actions : Edit, Delete, Toggle active/inactive
- Formulaire :
  - Nom, Description
  - Durée (minutes)
  - Prix ($)
  - Upload image (Firebase Storage)
  - Ordre d'affichage (drag & drop pour réordonner)
- Prévisualisation image
- Validation Zod

**Upload Firebase Storage** :
```typescript
// src/features/services/services/uploadImage.ts
async function uploadServiceImage(file: File, serviceId: string): Promise<string> {
  const storageRef = ref(storage, `services/${serviceId}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}
```

#### 6. Gestion Clients
**Composants** :
- `CustomersPage.tsx`
- `CustomerTable.tsx` - Liste clients
- `CustomerDetailsModal.tsx` - Historique réservations
- `LoyaltyPointsManager.tsx` - Gestion manuelle points

**Fonctionnalités** :
- Table : Nom, Téléphone, Email, Total RDV, Points, Tier
- Filtres : Tier, Nombre de RDV
- Recherche par nom/téléphone
- Détails client :
  - Historique réservations
  - Historique points
  - Statistiques (taux annulation, service préféré)
- Actions :
  - Ajuster points manuellement (bonus/correction)
  - Voir réservations futures
  - Bloquer client (optionnel)

#### 7. Modération Témoignages
**Composants** :
- `TestimonialsPage.tsx`
- `TestimonialModerationQueue.tsx` - Liste en attente
- `TestimonialCard.tsx` - Card avec actions

**Fonctionnalités** :
- Onglets : En attente, Approuvés, Rejetés
- Actions :
  - ✅ Approuver
  - ❌ Rejeter
  - ✏️ Modifier (corriger fautes)
  - 🗑️ Supprimer
- Bulk actions : Approuver plusieurs
- Tri par date, note

#### 8. Paramètres
**Composants** :
- `SettingsPage.tsx`
- `GeneralSettings.tsx` - Infos salon
- `BookingSettings.tsx` - Config réservations
- `LoyaltySettings.tsx` - Config fidélité
- `NotificationSettings.tsx` - Config emails/SMS
- `AdminUsersManager.tsx` - Gestion admins (super admin only)

**Fonctionnalités** :
- **Général** : Nom, adresse, téléphone, horaires, réseaux sociaux
- **Réservations** : Durée créneaux, buffer, délai annulation, avance max booking
- **Fidélité** : Points par $, seuils tiers, réductions par tier
- **Notifications** : Toggle email/SMS, API keys (SendGrid, Twilio), heures rappel
- **Admins** : Ajouter/retirer admins (super admin uniquement)

---

### 🔔 Système de Notifications (Cloud Functions)

#### Cloud Functions à créer

**1. onBookingCreated** (`functions/src/notifications.ts`)
```typescript
// Déclenché à chaque nouvelle réservation
export const onBookingCreated = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();

    // Email confirmation client
    if (booking.customerEmail) {
      await sendBookingConfirmationEmail(booking);
    }

    // SMS confirmation client
    if (settings.notifications.smsEnabled) {
      await sendBookingConfirmationSMS(booking);
    }

    // Notification admin (optionnel)
    await sendAdminNewBookingNotification(booking);
  });
```

**2. onBookingUpdated**
```typescript
// Déclenché lors de modification statut
export const onBookingUpdated = functions.firestore
  .document('bookings/{bookingId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Si annulation
    if (before.status !== 'cancelled' && after.status === 'cancelled') {
      await sendCancellationEmail(after);
    }
  });
```

**3. sendBookingReminders** (Scheduled)
```typescript
// Cron job quotidien : tous les jours à 9h
export const sendBookingReminders = functions.pubsub
  .schedule('0 9 * * *')
  .timeZone('America/Montreal')
  .onRun(async (context) => {
    // Récupérer réservations dans 24h
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookingsSnapshot = await db.collection('bookings')
      .where('date', '==', Timestamp.fromDate(tomorrow))
      .where('status', '==', 'confirmed')
      .where('reminderSent', '==', false)
      .get();

    // Envoyer rappels
    for (const doc of bookingsSnapshot.docs) {
      const booking = doc.data();

      if (booking.customerEmail) {
        await sendReminderEmail(booking);
      }

      await doc.ref.update({ reminderSent: true });
    }
  });
```

**4. calculateLoyaltyPoints**
```typescript
// Déclenché quand réservation marquée "completed"
export const calculateLoyaltyPoints = functions.firestore
  .document('bookings/{bookingId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Si passage à "completed"
    if (before.status !== 'completed' && after.status === 'completed') {
      const settings = await getSettings();
      const pointsEarned = Math.floor(
        after.servicePrice * settings.loyalty.pointsPerDollar
      );

      // Update customer points
      const customerRef = db.collection('customers').doc(after.customerId);
      await customerRef.update({
        loyaltyPoints: FieldValue.increment(pointsEarned),
        completedBookings: FieldValue.increment(1),
        lastVisit: after.date,
      });

      // Log transaction
      await db.collection('loyaltyTransactions').add({
        customerId: after.customerId,
        bookingId: context.params.bookingId,
        points: pointsEarned,
        type: 'earned',
        description: `Réservation ${after.serviceName}`,
        createdAt: FieldValue.serverTimestamp(),
      });

      // Update booking
      await change.after.ref.update({
        loyaltyPointsEarned: pointsEarned,
      });
    }
  });
```

#### Intégrations Email/SMS

**Email (SendGrid)** :
```typescript
// functions/src/services/email.service.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendBookingConfirmationEmail(booking: Booking) {
  const msg = {
    to: booking.customerEmail,
    from: 'no-reply@issoufcoiffure.com',
    templateId: 'd-xxxx', // SendGrid template ID
    dynamicTemplateData: {
      customerName: booking.customerName,
      serviceName: booking.serviceName,
      date: formatDate(booking.date),
      time: booking.startTime,
      salonAddress: '55 rue Saint-Luc, Chicoutimi',
      bookingId: booking.id,
      cancelUrl: `https://issoufcoiffure.com/cancel/${booking.id}`,
    },
  };

  await sgMail.send(msg);
}
```

**SMS (Twilio)** :
```typescript
// functions/src/services/sms.service.ts
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendBookingConfirmationSMS(booking: Booking) {
  await client.messages.create({
    body: `Bonjour ${booking.customerName}, votre rendez-vous chez Issouf Coiffure est confirmé le ${formatDate(booking.date)} à ${booking.startTime}. ID: ${booking.id}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: booking.customerPhone,
  });
}
```

---

## Phases d'Implémentation

### Phase 1 : Configuration & Foundation (3-4 jours)

**Tâches** :
1. ✅ Créer nouveau projet Vite + React + TypeScript
   ```bash
   npm create vite@latest SiteCoiffure-v2 -- --template react-ts
   cd SiteCoiffure-v2
   npm install
   ```

2. ✅ Installer dépendances
   ```bash
   # Core
   npm install react-router-dom zustand @tanstack/react-query

   # Firebase
   npm install firebase

   # Forms & Validation
   npm install react-hook-form zod @hookform/resolvers

   # UI
   npm install tailwindcss postcss autoprefixer
   npm install sonner react-icons
   npm install react-helmet-async
   npx shadcn@latest init

   # Utils
   npm install date-fns clsx tailwind-merge

   # Dev
   npm install -D @types/node prettier eslint-config-prettier
   ```

3. ✅ Configuration Tailwind + shadcn/ui
   - Installer shadcn components : `npx shadcn@latest add button input card dialog calendar select`
   - Configurer theme Tailwind (couleurs du projet actuel)

4. ✅ Configuration Firebase
   - Créer fichier `src/lib/firebase.ts`
   - Initialiser Firebase avec config fournie
   - Configurer Auth, Firestore, Storage

5. ✅ Configuration Zustand stores
   - `src/features/auth/store/authStore.ts`
   - `src/features/ui/store/uiStore.ts` (pour modals, sidebar, etc.)

6. ✅ Configuration TanStack Query
   - `src/app/providers/QueryProvider.tsx`

7. ✅ Structure de dossiers complète (voir Architecture)

8. ✅ Configuration TypeScript
   - Types globaux dans `src/shared/types/`
   - Path aliases dans `tsconfig.json` : `@/*` → `./src/*`

9. ✅ Configuration routing de base
   - Routes publiques
   - Routes admin protégées
   - 404 page

**Fichiers critiques à créer** :
- `src/lib/firebase.ts` - Config Firebase
- `src/shared/types/index.ts` - Types globaux
- `src/app/Router.tsx` - Configuration routes
- `firestore.rules` - Règles de sécurité
- `.env.local` - Variables environnement

**Livrable Phase 1** : Projet structuré, Firebase connecté, routing fonctionnel

---

### Phase 2 : Migration & Composants de Base (3-4 jours)

**Tâches** :

1. ✅ Migrer composants existants vers TypeScript
   - `Navbar.jsx` → `Navbar.tsx` (ajouter types pour liens, props)
   - `ImageSlider.jsx` → `ImageSlider.tsx`
   - `WhatsAppButton.jsx` → `WhatsAppButton.tsx`

2. ✅ Créer design system (shadcn + custom)
   - `Button.tsx` (variants: primary, secondary, ghost)
   - `Input.tsx`, `Textarea.tsx`
   - `Card.tsx`, `Badge.tsx`
   - `Modal.tsx` (Dialog shadcn)
   - `LoadingSpinner.tsx`
   - `EmptyState.tsx`
   - `ErrorBoundary.tsx`

3. ✅ Créer hooks utilitaires
   - `useMediaQuery.ts`
   - `useDebounce.ts`
   - `useToast.ts` (wrapper Sonner)
   - `useLocalStorage.ts`

4. ✅ Implémenter authentification admin
   - `LoginPage.tsx`
   - `LoginForm.tsx`
   - `authService.ts` (Firebase Auth)
   - `authStore.ts` (Zustand)
   - `useAuth.ts` hook
   - `AuthGuard.tsx` component
   - Route `/admin/login`

5. ✅ Créer AdminLayout
   - Sidebar responsive (collapsible)
   - Header avec user menu (logout)
   - Breadcrumbs
   - Mobile drawer navigation

6. ✅ Page d'accueil de base
   - `HomePage.tsx`
   - Sections : Hero, Services, Testimonials, Contact
   - Réutiliser ImageSlider, WhatsAppButton

**Fichiers à créer** :
- `src/shared/components/ui/*` - Design system
- `src/features/auth/*` - Système d'auth complet
- `src/features/admin/layouts/AdminLayout.tsx`
- `src/pages/HomePage.tsx`

**Tests** :
- Login admin fonctionnel
- Routes admin protégées
- Logout fonctionnel
- Design system testé visuellement

**Livrable Phase 2** : Auth admin opérationnelle, design system prêt, layout admin fonctionnel

---

### Phase 3 : Firestore & Services (3-4 jours)

**Tâches** :

1. ✅ Créer collections Firestore initiales
   - `settings/general` - Infos salon de base
   - `users/` - Créer premier admin manuellement via Firebase Console
   - `services/` - Ajouter 3-4 services de démo

2. ✅ Déployer Security Rules
   ```bash
   firebase deploy --only firestore:rules
   ```

3. ✅ Implémenter gestion Services (admin)
   - `ServicesPage.tsx` - Page admin services
   - `ServiceTable.tsx` - Table services
   - `ServiceForm.tsx` - Formulaire CRUD
   - `ImageUploader.tsx` - Upload Firebase Storage
   - Hooks :
     - `useServices.ts` (TanStack Query)
     - `useCreateService.ts` (mutation)
     - `useUpdateService.ts` (mutation)
     - `useDeleteService.ts` (mutation)
   - Route `/admin/services`

4. ✅ Affichage services côté client
   - `ServicesPage.tsx` (public)
   - `ServiceCard.tsx`
   - `usePublicServices.ts` (query avec filter active=true)
   - Route `/services`

5. ✅ Implémenter Settings (admin)
   - `SettingsPage.tsx` avec tabs
   - `GeneralSettings.tsx` - Formulaire infos salon
   - `BookingSettings.tsx` - Config réservations
   - `useSettings.ts`, `useUpdateSettings.ts`
   - Route `/admin/settings`

**Fichiers à créer** :
- `src/features/services/*` - Tout le module services
- `src/features/admin/pages/ServicesPage.tsx`
- `src/features/admin/pages/SettingsPage.tsx`
- `firestore.rules` (déjà créé en Phase 1)

**Tests** :
- CRUD services fonctionnel en admin
- Upload image vers Firebase Storage
- Affichage services publics
- Modification settings salon

**Livrable Phase 3** : Services managés en admin, affichés en public, settings configurables

---

### Phase 4 : Disponibilités & Logique Slots (4-5 jours)

**Tâches** :

1. ✅ Gestion disponibilités (admin)
   - `AvailabilityPage.tsx`
   - `TemplateManager.tsx` - CRUD horaires récurrents
   - `ExceptionManager.tsx` - CRUD exceptions (congés)
   - Hooks :
     - `useAvailabilityTemplates.ts`
     - `useCreateTemplate.ts`
     - `useAvailabilityExceptions.ts`
   - Route `/admin/availability`

2. ✅ Logique calcul slots disponibles
   - `src/features/booking/utils/slotCalculation.ts`
   - Fonction `calculateAvailableSlots()` :
     - Prend date, service, templates, exceptions, bookings existantes
     - Retourne array de slots avec statut
   - Tests unitaires pour cette fonction (Vitest)

3. ✅ Composant Calendar
   - `Calendar.tsx` (utiliser shadcn Calendar + date-fns)
   - Désactiver dates passées
   - Désactiver dates exceptions (congés)
   - Highlight dates disponibles

4. ✅ Composant SlotGrid
   - `SlotGrid.tsx`
   - Afficher slots disponibles pour date sélectionnée
   - Indicateur "disponible" / "complet"
   - Sélection slot

**Fichiers à créer** :
- `src/features/admin/pages/AvailabilityPage.tsx`
- `src/features/admin/components/TemplateManager.tsx`
- `src/features/admin/components/ExceptionManager.tsx`
- `src/features/booking/utils/slotCalculation.ts` ⚠️ **Critique**
- `src/features/booking/components/Calendar.tsx`
- `src/features/booking/components/SlotGrid.tsx`

**Tests** :
- Créer templates horaires
- Ajouter exceptions (congé, férié)
- Vérifier calcul slots (unitaires)
- Affichage calendrier avec dates désactivées

**Livrable Phase 4** : Système de disponibilités fonctionnel, logique slots robuste

---

### Phase 5 : Flow Réservation Client (4-5 jours)

**Tâches** :

1. ✅ Créer BookingWizard (stepper multi-étapes)
   - `BookingPage.tsx` - Container
   - `BookingWizard.tsx` - Stepper navigation (4 steps)
   - State management : Zustand store `bookingStore.ts`

2. ✅ Step 1 : Sélection Service
   - `ServiceSelector.tsx`
   - Grille services avec images
   - Sélection service → next step

3. ✅ Step 2 : Date & Heure
   - `DateTimeSelector.tsx`
   - Calendar (désactiver dates indisponibles)
   - SlotGrid (afficher slots pour date + service)
   - Temps réel : re-query si date change

4. ✅ Step 3 : Infos Client
   - `CustomerInfoForm.tsx`
   - Champs : Nom, Téléphone (requis), Email (optionnel)
   - Validation Zod
   - Vérifier si client existe (par téléphone)
   - Si existe : afficher points fidélité

5. ✅ Step 4 : Récapitulatif
   - `BookingSummary.tsx`
   - Afficher tous les détails
   - Bouton "Confirmer"
   - Mutation : créer booking + customer (si nouveau)
   - Toast success
   - Redirection vers ConfirmationPage

6. ✅ Page Confirmation
   - `ConfirmationPage.tsx`
   - Afficher détails réservation
   - Bouton "Ajouter au calendrier" (ICS file)
   - Lien annulation
   - Infos contact salon

**Fichiers à créer** :
- `src/features/booking/store/bookingStore.ts`
- `src/features/booking/pages/BookingPage.tsx`
- `src/features/booking/components/BookingWizard.tsx`
- `src/features/booking/components/ServiceSelector.tsx`
- `src/features/booking/components/DateTimeSelector.tsx`
- `src/features/booking/components/CustomerInfoForm.tsx`
- `src/features/booking/components/BookingSummary.tsx`
- `src/pages/ConfirmationPage.tsx`
- `src/features/booking/hooks/useCreateBooking.ts` (mutation)

**Tests** :
- Flow complet : service → date → infos → confirmation
- Validation formulaire
- Création booking dans Firestore
- Création customer si nouveau

**Livrable Phase 5** : Flow de réservation complet et fonctionnel côté client

---

### Phase 6 : Gestion Réservations Admin (3-4 jours)

**Tâches** :

1. ✅ Page Réservations (admin)
   - `BookingsPage.tsx`
   - `BookingTable.tsx` - Table responsive
   - Colonnes : Client, Service, Date, Heure, Statut, Actions
   - Mobile : afficher en cards (comme actuel)

2. ✅ Filtres & Recherche
   - `BookingFilters.tsx`
   - Filtres : Date range, Statut, Service
   - Recherche : Nom ou téléphone client
   - Utiliser TanStack Query filters

3. ✅ Actions réservations
   - `BookingDetailsModal.tsx` - Modal détails
   - Actions :
     - Confirmer
     - Modifier (date/heure/service)
     - Annuler (avec raison)
     - Marquer complété
     - Marquer no-show
     - Ajouter notes internes
   - Hooks mutations pour chaque action

4. ✅ Pagination
   - 20 réservations par page
   - Composant `Pagination.tsx`

5. ✅ Export CSV
   - Bouton "Exporter"
   - Générer CSV des réservations filtrées
   - Colonnes : tous les champs

**Fichiers à créer** :
- `src/features/admin/pages/BookingsPage.tsx`
- `src/features/admin/components/BookingTable.tsx`
- `src/features/admin/components/BookingFilters.tsx`
- `src/features/admin/components/BookingDetailsModal.tsx`
- `src/features/admin/hooks/useBookings.ts`
- `src/features/admin/hooks/useUpdateBooking.ts`
- `src/features/admin/hooks/useDeleteBooking.ts`
- `src/shared/components/Pagination.tsx`

**Tests** :
- Afficher liste réservations
- Filtrer par statut, date
- Modifier réservation
- Annuler réservation
- Export CSV

**Livrable Phase 6** : Gestion complète des réservations en admin

---

### Phase 7 : Dashboard & Stats (2-3 jours)

**Tâches** :

1. ✅ Créer Dashboard Overview
   - `DashboardPage.tsx`
   - `StatsCards.tsx` - KPIs cards
   - Métriques :
     - Réservations aujourd'hui
     - Réservations cette semaine
     - Revenus période
     - Taux annulation

2. ✅ Graphiques
   - Installer `react-chartjs-2` + `chart.js`
   - `RevenueChart.tsx` - Graphique revenus (line chart)
   - `ServicePopularityChart.tsx` - Services populaires (bar chart)

3. ✅ Widgets
   - `UpcomingBookings.tsx` - 5 prochains RDV
   - `RecentActivity.tsx` - Activités récentes

4. ✅ Hooks stats
   - `useDashboardStats.ts` - Query agrégations Firestore
   - Optimiser avec indexes Firestore

**Fichiers à créer** :
- `src/features/admin/pages/DashboardPage.tsx`
- `src/features/admin/components/StatsCards.tsx`
- `src/features/admin/components/RevenueChart.tsx`
- `src/features/admin/components/UpcomingBookings.tsx`
- `src/features/admin/hooks/useDashboardStats.ts`

**Tests** :
- Affichage KPIs corrects
- Graphiques affichent données
- Refresh automatique (polling)

**Livrable Phase 7** : Dashboard admin avec statistiques et graphiques

---

### Phase 8 : Fidélité & Clients (3-4 jours)

**Tâches** :

1. ✅ Gestion Clients (admin)
   - `CustomersPage.tsx`
   - `CustomerTable.tsx` - Liste clients
   - Colonnes : Nom, Téléphone, RDV, Points, Tier
   - `CustomerDetailsModal.tsx` - Détails client
     - Historique réservations
     - Historique points
     - Statistiques

2. ✅ Système Points (admin)
   - `LoyaltyPointsManager.tsx` - Ajustement manuel points
   - Formulaire : Ajouter/Retirer points + raison
   - Hook `useAdjustPoints.ts` (mutation)

3. ✅ Affichage Fidélité (client)
   - `LoyaltyCard.tsx` - Composant affichage points/tier
   - `LoyaltyBenefits.tsx` - Avantages par tier
   - `PointsHistory.tsx` - Historique transactions
   - Intégrer dans `CustomerInfoForm` du booking flow

4. ✅ Configuration Fidélité (admin)
   - `LoyaltySettings.tsx` - Formulaire config
   - Champs : Points par $, Seuils tiers, Réductions
   - Route `/admin/settings` (onglet Fidélité)

5. ✅ Calcul automatique points
   - Cloud Function `calculateLoyaltyPoints` (voir section Notifications)
   - Trigger sur booking status → completed

**Fichiers à créer** :
- `src/features/admin/pages/CustomersPage.tsx`
- `src/features/admin/components/CustomerTable.tsx`
- `src/features/admin/components/CustomerDetailsModal.tsx`
- `src/features/admin/components/LoyaltyPointsManager.tsx`
- `src/features/loyalty/components/LoyaltyCard.tsx`
- `src/features/loyalty/components/PointsHistory.tsx`
- `src/features/admin/components/LoyaltySettings.tsx`
- `functions/src/loyalty.ts` (Cloud Function)

**Tests** :
- Afficher liste clients
- Voir détails client
- Ajuster points manuellement
- Calcul automatique points (Cloud Function)
- Affichage points côté client

**Livrable Phase 8** : Système de fidélité complet et fonctionnel

---

### Phase 9 : Témoignages & Annulation (2-3 jours)

**Tâches** :

1. ✅ Témoignages (client)
   - `TestimonialForm.tsx` - Formulaire soumission
   - Champs : Nom, Ville, Note (1-5), Message
   - Validation Zod
   - Soumission → Firestore (approved: false)
   - `TestimonialDisplay.tsx` - Affichage avis approuvés
   - Intégrer dans HomePage

2. ✅ Modération Témoignages (admin)
   - `TestimonialsPage.tsx`
   - Onglets : En attente, Approuvés, Rejetés
   - `TestimonialModerationQueue.tsx`
   - Actions : Approuver, Rejeter, Modifier, Supprimer
   - Bulk actions
   - Route `/admin/testimonials`

3. ✅ Annulation Réservation (client)
   - `CancelBookingPage.tsx` - Route `/cancel/:bookingId`
   - `CancelForm.tsx` - Formulaire avec vérification téléphone
   - Afficher détails réservation
   - Formulaire motif annulation
   - Mutation : update booking status
   - Vérifier délai 24h (depuis settings)

4. ✅ Politique Annulation
   - Migrer `PolitiqueAnnulation.jsx` → `PolitiqueAnnulation.tsx`
   - Afficher délai depuis settings
   - Intégrer dans flow booking

**Fichiers à créer** :
- `src/features/testimonials/components/TestimonialForm.tsx`
- `src/features/testimonials/components/TestimonialDisplay.tsx`
- `src/features/admin/pages/TestimonialsPage.tsx`
- `src/features/admin/components/TestimonialModerationQueue.tsx`
- `src/pages/CancelBookingPage.tsx`
- `src/features/booking/components/CancelForm.tsx`

**Tests** :
- Soumettre témoignage
- Approuver/rejeter témoignage en admin
- Annuler réservation (vérif téléphone)
- Vérifier délai 24h

**Livrable Phase 9** : Témoignages et annulations fonctionnels

---

### Phase 10 : Notifications (Cloud Functions) (3-4 jours)

**Tâches** :

1. ✅ Setup Firebase Functions
   ```bash
   firebase init functions
   cd functions
   npm install @sendgrid/mail twilio
   ```

2. ✅ Configuration Email (SendGrid)
   - Créer compte SendGrid
   - Créer templates email :
     - Confirmation réservation
     - Annulation
     - Rappel 24h avant
   - Ajouter API key dans `.env`

3. ✅ Configuration SMS (Twilio)
   - Créer compte Twilio
   - Acheter numéro téléphone
   - Ajouter credentials dans `.env`

4. ✅ Implémenter Cloud Functions
   - `onBookingCreated` - Email/SMS confirmation
   - `onBookingUpdated` - Email annulation
   - `sendBookingReminders` - Cron job rappels
   - `calculateLoyaltyPoints` - Calcul automatique

5. ✅ Déployer Functions
   ```bash
   firebase deploy --only functions
   ```

6. ✅ Tester notifications
   - Créer réservation → email/SMS confirmation
   - Annuler réservation → email confirmation
   - Tester cron job (manuellement via Firebase Console)

7. ✅ Configuration Notifications (admin)
   - `NotificationSettings.tsx` - Formulaire config
   - Toggle email/SMS
   - API keys (masqués)
   - Heures rappel
   - Route `/admin/settings` (onglet Notifications)

**Fichiers à créer** :
- `functions/src/notifications.ts` ⚠️ **Cloud Function**
- `functions/src/loyalty.ts` ⚠️ **Cloud Function**
- `functions/src/services/email.service.ts`
- `functions/src/services/sms.service.ts`
- `src/features/admin/components/NotificationSettings.tsx`

**Tests** :
- Email confirmation envoyé
- SMS confirmation envoyé
- Rappel automatique 24h avant
- Points fidélité calculés automatiquement

**Livrable Phase 10** : Système de notifications complet (Email + SMS)

---

### Phase 11 : Polish & Optimisation (3-4 jours)

**Tâches** :

1. ✅ SEO Optimization
   - Installer `react-helmet-async`
   - Ajouter meta tags par page
   - Structured data (JSON-LD) pour Local Business
   - Sitemap.xml
   - Robots.txt

2. ✅ Performance
   - Lazy loading routes admin
   - Image optimization (WebP, lazy load)
   - Code splitting
   - Analyser bundle : `npm install -D vite-bundle-visualizer`
   - Optimiser Firestore queries (indexes)

3. ✅ Accessibilité
   - Audit avec axe DevTools
   - Vérifier contraste couleurs
   - Navigation clavier
   - ARIA labels

4. ✅ Responsive Design Audit
   - Tester toutes pages sur mobile/tablet/desktop
   - Corriger problèmes layout

5. ✅ Error Handling
   - `ErrorBoundary` global
   - Page 404 custom
   - Toast notifications pour erreurs
   - Sentry integration (optionnel)

6. ✅ Loading States
   - Skeleton loaders pour tables
   - Spinner pour actions
   - Optimistic updates TanStack Query

7. ✅ Documentation
   - README.md - Setup instructions
   - CONTRIBUTING.md
   - Environnement variables doc
   - API documentation (Firestore structure)

**Fichiers à créer** :
- `src/components/ErrorBoundary.tsx`
- `src/pages/NotFoundPage.tsx`
- `README.md` - Documentation projet
- `docs/FIREBASE_SETUP.md`
- `docs/DEPLOYMENT.md`

**Tests** :
- Lighthouse audit (Performance, Accessibility, SEO)
- Test responsive toutes pages
- Test error boundaries
- Bundle size analysis

**Livrable Phase 11** : Application optimisée, accessible, performante

---

### Phase 12 : Tests & Déploiement (3-4 jours)

**Tâches** :

1. ✅ Tests Unitaires
   - `slotCalculation.test.ts` - Logique slots
   - Validation schemas Zod
   - Hooks utilitaires
   - Target: 80%+ coverage logique métier

2. ✅ Tests Intégration
   - Composants clés avec React Testing Library
   - BookingWizard flow
   - Admin CRUD operations

3. ✅ Tests E2E (Playwright)
   - Flow réservation complet
   - Login admin → CRUD service
   - Login admin → Gérer réservation

4. ✅ CI/CD Setup (GitHub Actions)
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to Firebase
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Install dependencies
           run: npm ci
         - name: Run tests
           run: npm test
         - name: Build
           run: npm run build
         - name: Deploy to Firebase
           uses: FirebaseExtended/action-hosting-deploy@v0
           with:
             repoToken: '${{ secrets.GITHUB_TOKEN }}'
             firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
             projectId: coiffure-3656c
   ```

5. ✅ Déploiement Firebase Hosting
   ```bash
   firebase init hosting
   firebase deploy --only hosting
   ```

6. ✅ Configuration domaine custom (optionnel)
   - Acheter domaine
   - Configurer DNS
   - Ajouter domaine dans Firebase Hosting

7. ✅ Configuration environnements
   - Production : Firebase project principal
   - Staging : Firebase project séparé (optionnel)

8. ✅ Monitoring
   - Firebase Performance Monitoring
   - Firebase Crashlytics (Web)
   - Google Analytics 4

**Fichiers à créer** :
- `src/features/booking/utils/__tests__/slotCalculation.test.ts`
- `tests/e2e/booking-flow.spec.ts`
- `tests/e2e/admin-crud.spec.ts`
- `.github/workflows/deploy.yml`
- `firebase.json` (hosting config)

**Tests** :
- All tests passing
- E2E tests passing
- Build successful
- Deployed to Firebase Hosting

**Livrable Phase 12** : Application testée, déployée, en production

---

## Vérification & Testing

### Tests Manuels Critiques

**Client Side** :
1. ✅ Réserver un service complet (service → date → infos → confirmation)
2. ✅ Vérifier email/SMS confirmation reçus
3. ✅ Annuler réservation (vérifier vérification téléphone)
4. ✅ Soumettre témoignage
5. ✅ Afficher points fidélité (si client existant)
6. ✅ Navigation mobile (menu drawer)
7. ✅ Responsive design toutes pages

**Admin Side** :
1. ✅ Login admin
2. ✅ Créer/modifier/supprimer service (avec image)
3. ✅ Configurer disponibilités (templates + exceptions)
4. ✅ Gérer réservations (filtrer, modifier, annuler, marquer complété)
5. ✅ Voir dashboard stats (KPIs, graphiques)
6. ✅ Gérer clients (voir détails, ajuster points)
7. ✅ Modérer témoignages (approuver, rejeter)
8. ✅ Modifier settings (salon, réservations, fidélité, notifications)
9. ✅ Vérifier calcul automatique points (marquer réservation complétée)
10. ✅ Logout admin

**Cloud Functions** :
1. ✅ Créer réservation → email/SMS envoyés
2. ✅ Annuler réservation → email annulation envoyé
3. ✅ Marquer réservation complétée → points ajoutés automatiquement
4. ✅ Cron job rappels (déclencher manuellement via Firebase Console)

### Tests Automatisés

**Unitaires (Vitest)** :
- `slotCalculation.test.ts` - Calcul slots disponibles
- `loyaltyCalculation.test.ts` - Calcul points, tiers
- Validation schemas Zod
- Hooks utilitaires

**Intégration (React Testing Library)** :
- `BookingWizard.test.tsx` - Flow multi-étapes
- `ServiceForm.test.tsx` - CRUD service
- `LoginForm.test.tsx` - Authentification

**E2E (Playwright)** :
- `booking-flow.spec.ts` - Réservation complète
- `admin-crud.spec.ts` - CRUD admin
- `authentication.spec.ts` - Login/logout

### Performance Targets

- **Lighthouse Score** :
  - Performance : 90+
  - Accessibility : 95+
  - Best Practices : 95+
  - SEO : 100

- **Core Web Vitals** :
  - LCP (Largest Contentful Paint) : < 2.5s
  - FID (First Input Delay) : < 100ms
  - CLS (Cumulative Layout Shift) : < 0.1

- **Bundle Size** :
  - Initial bundle : < 300KB (gzipped)
  - Admin bundle (lazy loaded) : < 400KB (gzipped)

### Security Checklist

- ✅ Firebase Security Rules déployées et testées
- ✅ Variables environnement sécurisées (.env.local gitignored)
- ✅ API keys SendGrid/Twilio dans Cloud Functions secrets
- ✅ Routes admin protégées avec AuthGuard
- ✅ Validation côté client ET serveur (Firestore Rules)
- ✅ Rate limiting sur Cloud Functions (optionnel)
- ✅ HTTPS enforced (Firebase Hosting par défaut)

---

## Fichiers Critiques à Référencer

### Existants (à migrer/réutiliser)
- `SiteCoiffure/src/components/Navbar.jsx` - Navigation excellente
- `SiteCoiffure/src/components/ImageSlider.jsx` - Carrousel images
- `SiteCoiffure/src/components/WhatsAppButton.jsx` - Bouton WhatsApp
- `SiteCoiffure/src/components/Temoignages.jsx` - Base témoignages
- `SiteCoiffure/src/assets/` - Images et logo
- `SiteCoiffure/src/App.css` - Styles à adapter

### Nouveaux (à créer)
- `src/lib/firebase.ts` ⚠️ Configuration Firebase
- `src/features/booking/utils/slotCalculation.ts` ⚠️ Logique critique
- `firestore.rules` ⚠️ Sécurité database
- `functions/src/notifications.ts` ⚠️ Cloud Functions
- `functions/src/loyalty.ts` ⚠️ Cloud Functions
- `.env.local` ⚠️ Variables environnement
- `src/app/Router.tsx` - Configuration routes
- `src/features/auth/store/authStore.ts` - State auth
- `src/features/booking/store/bookingStore.ts` - State booking

---

## Estimation Temps Total

**36-45 jours** (environ 8-9 semaines de travail) pour une refonte complète avec toutes les fonctionnalités.

**Répartition** :
- Phase 1-2 : Setup & Foundation (6-8 jours)
- Phase 3-5 : Core Features (10-13 jours)
- Phase 6-9 : Admin & Client Features (10-14 jours)
- Phase 10-12 : Advanced & Polish (9-12 jours)

---

## Prochaines Étapes Immédiates

1. ✅ Approuver ce plan
2. ✅ Créer nouveau projet Vite + TypeScript
3. ✅ Installer dépendances (Phase 1)
4. ✅ Configurer Firebase avec config fournie
5. ✅ Créer structure de dossiers complète
6. ✅ Démarrer Phase 1

**Prêt à commencer !** 🚀

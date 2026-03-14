# 🔥 Configuration Firebase - Guide Complet

## Prérequis

- Compte Firebase (https://console.firebase.google.com)
- Node.js installé
- Firebase CLI installé : `npm install -g firebase-tools`

## 1. Configuration du Projet Firebase

### Créer un projet Firebase

1. Aller sur https://console.firebase.google.com
2. Cliquer sur "Ajouter un projet"
3. Nom du projet : `coiffure-3656c` (ou votre nom)
4. Désactiver Google Analytics (optionnel)

### Activer les services

#### Authentication
1. Dans la console → Authentication
2. Cliquer sur "Commencer"
3. Activer "Email/Password"

#### Cloud Firestore
1. Dans la console → Firestore Database
2. Cliquer sur "Créer une base de données"
3. Mode : **Production** (important pour les rules)
4. Région : `us-central` ou `northamerica-northeast1` (Montréal)

#### Storage
1. Dans la console → Storage
2. Cliquer sur "Commencer"
3. Mode : Production
4. Région : Même que Firestore

## 2. Configuration de l'Application Web

1. Dans la console → Paramètres du projet (⚙️)
2. Défiler vers "Vos applications"
3. Cliquer sur l'icône Web `</>`
4. Nom : "Site Coiffure Web"
5. Cocher "Firebase Hosting" (optionnel)
6. Copier la configuration Firebase

Le fichier `lib/firebase.ts` est déjà configuré avec :

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyCOzT4QWVR9VSSNYqjZV5Bd7mZBTWV3Uys",
  authDomain: "coiffure-3656c.firebaseapp.com",
  projectId: "coiffure-3656c",
  storageBucket: "coiffure-3656c.firebasestorage.app",
  messagingSenderId: "691429484941",
  appId: "1:691429484941:web:7d2bd301db54a33df435c4",
  measurementId: "G-9XTE0DTR87"
};
```

⚠️ **Important** : En production, utiliser des variables d'environnement !

## 3. Créer le Premier Utilisateur Admin

### Via Firebase Console

1. **Authentication** → Onglet "Users"
2. Cliquer sur "Add user"
3. Email : `admin@issouf.com`
4. Password : Choisir un mot de passe sécurisé
5. Cliquer sur "Add user"
6. **Copier l'UID** de l'utilisateur créé

### Ajouter dans Firestore

1. **Firestore Database** → Onglet "Data"
2. Cliquer sur "Start collection"
3. Collection ID : `users`
4. Document ID : **Coller l'UID copié**
5. Ajouter les champs :

```
Field                 Type        Value
-------------------------------------------
email                 string      admin@issouf.com
displayName           string      Administrateur
role                  string      super_admin
createdAt             timestamp   (Now)
lastLogin             timestamp   (Now)
```

6. Cliquer sur "Save"

## 4. Configurer les Security Rules

### Firestore Rules

Dans Firestore → Onglet "Rules", remplacer par :

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

    // Users: admin read, super admin write
    match /users/{userId} {
      allow read: if isAdmin();
      allow write: if isSuperAdmin();
    }

    // Settings: public read, admin write
    match /settings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Services: public read (active only), admin write
    match /services/{serviceId} {
      allow read: if resource.data.active == true;
      allow list: if isAdmin() ||
                     (request.query.limit <= 50 &&
                      resource.data.active == true);
      allow create, update, delete: if isAdmin();
    }
  }
}
```

Cliquer sur "Publier"

### Storage Rules

Dans Storage → Onglet "Rules", remplacer par :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Helper function
    function isAdmin() {
      return request.auth != null &&
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }

    // Service images: admin write, public read
    match /services/{serviceId}/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // All other files: admin only
    match /{allPaths=**} {
      allow read, write: if isAdmin();
    }
  }
}
```

Cliquer sur "Publier"

## 5. Créer les Collections Initiales

### Collection `settings`

1. Firestore → "Start collection"
2. Collection ID : `settings`
3. Document ID : `general`
4. Champs :

```json
{
  "salonName": "Issouf Coiffure",
  "phone": "+1 (418) 555-0100",
  "whatsappNumber": "+14185550100",
  "address": {
    "street": "55 rue Saint-Luc",
    "city": "Chicoutimi",
    "postalCode": "G7J 1A1"
  },
  "hours": {
    "monday": { "open": "09:00", "close": "18:00" },
    "tuesday": { "open": "09:00", "close": "18:00" },
    "wednesday": { "open": "09:00", "close": "18:00" },
    "thursday": { "open": "09:00", "close": "20:00" },
    "friday": { "open": "09:00", "close": "20:00" },
    "saturday": { "open": "09:00", "close": "17:00" },
    "sunday": { "open": "closed", "close": "closed" }
  },
  "socialMedia": {
    "facebook": "https://facebook.com/issoufcoiffure",
    "instagram": "https://instagram.com/issoufcoiffure"
  }
}
```

## 6. Déployer avec Firebase CLI (Optionnel)

### Initialiser Firebase

```bash
cd site-coiffure-next
firebase login
firebase init
```

Sélectionner :
- ✅ Firestore
- ✅ Storage
- ✅ Hosting (optionnel)

### Déployer les règles

```bash
# Déployer tout
firebase deploy

# Ou seulement les règles
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

## 7. Variables d'Environnement (Production)

Pour la production, créer un fichier `.env.local` :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCOzT4QWVR9VSSNYqjZV5Bd7mZBTWV3Uys
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=coiffure-3656c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=coiffure-3656c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=coiffure-3656c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=691429484941
NEXT_PUBLIC_FIREBASE_APP_ID=1:691429484941:web:7d2bd301db54a33df435c4
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-9XTE0DTR87
```

Puis modifier `lib/firebase.ts` :

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
```

⚠️ Ajouter `.env.local` au `.gitignore` !

## 8. Tester la Configuration

```bash
npm run dev
```

1. Aller sur http://localhost:3000/admin/login
2. Se connecter avec `admin@issouf.com`
3. Vous devriez être redirigé vers `/admin/dashboard`
4. Vérifier dans la console qu'il n'y a pas d'erreurs

## 🐛 Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Vérifier que l'API key est correcte dans `firebase.ts`
- Vérifier que le projet Firebase existe

### "Missing or insufficient permissions"
- Vérifier que les Firestore Rules sont déployées
- Vérifier que l'utilisateur a le role "admin" dans Firestore
- Vérifier que le document users/{uid} existe

### "User not found in database"
- Créer le document dans Firestore users/ avec le bon UID
- Vérifier que le champ "role" existe et vaut "admin" ou "super_admin"

### Authentification qui ne persiste pas
- Vérifier que les cookies tiers sont autorisés
- Vérifier localStorage dans DevTools
- Essayer en navigation privée

## 📚 Ressources

- [Firebase Console](https://console.firebase.google.com)
- [Documentation Firebase Auth](https://firebase.google.com/docs/auth)
- [Documentation Firestore](https://firebase.google.com/docs/firestore)
- [Documentation Storage](https://firebase.google.com/docs/storage)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

---

✅ Configuration terminée ! Vous pouvez maintenant utiliser le système d'authentification.

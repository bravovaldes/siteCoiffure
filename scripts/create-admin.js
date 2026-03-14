/**
 * Script pour créer un utilisateur admin
 * Usage: node scripts/create-admin.js
 */

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Configuration Firebase (copier depuis lib/firebase.ts)
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
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
  try {
    console.log('🚀 Création de l\'utilisateur admin...\n');

    // Données admin
    const email = 'admin@issouf.com';
    const password = 'Admin123!'; // ⚠️ CHANGEZ CE MOT DE PASSE !
    const displayName = 'Administrateur';
    const role = 'super_admin';

    // 1. Créer l'utilisateur dans Authentication
    console.log('📧 Création du compte Authentication...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ Utilisateur créé avec UID:', user.uid);

    // 2. Créer le document dans Firestore
    console.log('\n📝 Création du document Firestore...');
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName,
      role,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
    console.log('✅ Document Firestore créé');

    console.log('\n🎉 Admin créé avec succès !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email    :', email);
    console.log('🔑 Password :', password);
    console.log('👤 Role     :', role);
    console.log('🆔 UID      :', user.uid);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT : Changez le mot de passe après la première connexion !');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur lors de la création:', error.message);

    if (error.code === 'auth/email-already-in-use') {
      console.log('\n💡 Cet email est déjà utilisé. L\'utilisateur existe peut-être déjà.');
    }

    process.exit(1);
  }
}

// Exécuter le script
createAdmin();

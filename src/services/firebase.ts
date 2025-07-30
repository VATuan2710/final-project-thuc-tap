import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDqCyzp6n8ezewRvX1izcW67Olz03J_0EE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "final-project-9cb13.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "final-project-9cb13",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "final-project-9cb13.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "920927778091",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:920927778091:web:c4c1647b87b99ece3f816e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SK74XFFJVC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure Facebook provider with minimal settings
facebookProvider.setCustomParameters({
  display: 'popup'
});

export default app; 
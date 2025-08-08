// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAJSGSJmIl_st2DxTpo7tpVO1H3W-TXEbc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "quantify-2ab6f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "quantify-2ab6f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "quantify-2ab6f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1014036263747",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1014036263747:web:aed8ddc8e58f7c033b35f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

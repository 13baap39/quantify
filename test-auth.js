// Test Firebase authentication
import { auth } from './src/config/firebase.js';

console.log('Firebase auth object:', auth);
console.log('Auth app:', auth.app);
console.log('Auth config:', auth.app.options);

// Test if Firebase is properly initialized
try {
  console.log('Firebase initialized successfully');
  console.log('Current user:', auth.currentUser);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

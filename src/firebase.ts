import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';
import { getDatabase, ref, set, onValue } from 'firebase/database';

export const firebaseConfig = {
  apiKey: "AIzaSyBB5_j-1pdo7mQYz-Er7GORztBzsOvdIas",
  authDomain: "black-book-65d42.firebaseapp.com",
  databaseURL: "https://black-book-65d42-default-rtdb.firebaseio.com",
  projectId: "black-book-65d42",
  storageBucket: "black-book-65d42.appspot.com",
  messagingSenderId: "199295305930",
  appId: "1:199295305930:web:326061ea4e1b862a770c33",
  measurementId: "G-TSEL4EKEP1"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore (single source of truth on black-book-65d42)
export const db = getFirestore(app);

// Initialize Realtime Database
export const rtdb = getDatabase(app);

// Export Firestore primitives for application use
export { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  writeBatch,
  ref,
  set,
  onValue
};

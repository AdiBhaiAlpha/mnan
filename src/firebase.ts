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
import firebaseConfigJson from '../firebase-applet-config.json';

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

// Initialize Cloud Firestore with database ID handling
const customDbId = firebaseConfigJson?.firestoreDatabaseId || 'ai-studio-mukulniketonreun-c15b3339-137c-443a-95ea-20e391b1ae08';

export const db = (customDbId && customDbId !== '(default)')
  ? getFirestore(app, customDbId)
  : getFirestore(app);

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

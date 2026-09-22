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
  apiKey: "AIzaSyBIuJFn74hJK1LT_Shcl-Y5DMgiOArB8Ps",
  authDomain: "shipu-ai.firebaseapp.com",
  databaseURL: "https://shipu-ai-default-rtdb.firebaseio.com",
  projectId: "shipu-ai",
  storageBucket: "shipu-ai.firebasestorage.app",
  messagingSenderId: "953122849300",
  appId: "1:953122849300:web:f821f1a161ce7879001d01",
  measurementId: "G-N2WMSS3MNG"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore (single source of truth on shipu-ai)
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

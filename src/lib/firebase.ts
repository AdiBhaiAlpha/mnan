import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, get, child, push, remove, update } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

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

// Initialize Firebase App instance
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize and export Realtime Database instance
export const database = getDatabase(app);
export const rtdb = database;

// Export Cloud Firestore reference
export const db = getFirestore(app);

// Export Realtime Database helpers
export {
  ref,
  set,
  onValue,
  get,
  child,
  push,
  remove,
  update
};

export default database;

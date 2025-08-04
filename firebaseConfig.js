// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage'
import {getFirestore, Timestamp, FieldValue} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getDatabase} from 'firebase/database'
import analytics from '@react-native-firebase/analytics';

// Firebase configuration - Replace with your own Firebase project credentials
// Get these values from your Firebase Console: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const firebaseAnalytics = analytics();

export default app  
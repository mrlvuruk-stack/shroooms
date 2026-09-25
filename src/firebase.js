import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAq95OYFnwivm3w0UnUN6cNvHZezvWpwyk",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "shrooom-6b9b8.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "shroooms",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "shrooom-6b9b8.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1001458273119",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1001458273119:web:e7aa84b9c3952b4e7104ea",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-1DJWKY905L"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth & Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Auth Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Analytics conditionally
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized successfully.");
    }
  }).catch((err) => {
    console.warn("Firebase Analytics initialization skipped or unsupported:", err);
  });
}

export {
  app,
  auth,
  db,
  googleProvider,
  analytics,
  firebaseConfig,
  // Auth methods
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  updateProfile,
  // Firestore methods
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
};

export default app;

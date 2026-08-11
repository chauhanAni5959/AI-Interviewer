// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ai-interviewer-6f0c3.firebaseapp.com",
  projectId: "ai-interviewer-6f0c3",
  storageBucket: "ai-interviewer-6f0c3.firebasestorage.app",
  messagingSenderId: "493496977516",
  appId: "1:493496977516:web:b59adbec32b5c01e6b7049",
  measurementId: "G-Y9S1S40HTX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider}  

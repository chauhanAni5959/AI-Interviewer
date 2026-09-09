// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const apiKey =
  import.meta.env.VITE_FIREBASE_APIKEY;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey,
  authDomain: "ai-interviewer-6f0c3.firebaseapp.com",
  projectId: "ai-interviewer-6f0c3",
  storageBucket: "ai-interviewer-6f0c3.firebasestorage.app",
  messagingSenderId: "493496977516",
  appId: "1:493496977516:web:b59adbec32b5c01e6b7049",
  measurementId: "G-Y9S1S40HTX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

export const getFirebaseAuth = () => {
  if (!apiKey || apiKey === "your_firebase_web_api_key") {
    throw new Error(
      "Missing Firebase Web API key. Set VITE_FIREBASE_API_KEY in client/.env.",
    );
  }

  return getAuth(app);
};
export { provider };

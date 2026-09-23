import { cert, initializeApp } from "firebase-admin/app";
import serviceAccountKey from "./serviceAccountKey.json" with { type: "json" };

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const credential =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  privateKey
    ? {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }
    : serviceAccountKey;

export const app = initializeApp({
  credential: cert(credential),
});

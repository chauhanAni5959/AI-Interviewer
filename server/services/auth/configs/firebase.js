import { initializeApp } from "firebase-admin/app";
import { serviceAccountKey } from "../serviceAccountKey.json";

export const app = initializeApp({
  credential: cert(serviceAccountKey),
});

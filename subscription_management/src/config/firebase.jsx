import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDzIgMd8xLQtzIJVKVJep7Pkz4BpONI3bE",
  authDomain: "subscription-management-c5569.firebaseapp.com",
  projectId: "subscription-management-c5569",
  storageBucket: "subscription-management-c5569.firebasestorage.app",
  messagingSenderId: "526313794704",
  appId: "1:526313794704:web:d8e082d15bd5d4d21efc15",
  measurementId: "G-Q90D1XMFW0",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

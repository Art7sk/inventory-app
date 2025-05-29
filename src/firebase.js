// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8jnZv-dQmLzqm_reoge-6OfcCuwvHmac",
  authDomain: "inventory-app-541b8.firebaseapp.com",
  projectId: "inventory-app-541b8",
  storageBucket: "inventory-app-541b8.firebasestorage.app",
  messagingSenderId: "367395163803",
  appId: "1:367395163803:web:b1b5abb313c43441fdc03e",
  measurementId: "G-7CMJGLFKF0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

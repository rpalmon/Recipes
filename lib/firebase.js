// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBEodf2EUNq-hURFCMGjBeX1Lij-HVwGgM",
    authDomain: "recipeapp-c0b95.firebaseapp.com",
    projectId: "recipeapp-c0b95",
    storageBucket: "recipeapp-c0b95.firebasestorage.app",
    messagingSenderId: "120109688126",
    appId: "1:120109688126:web:f624c7c7cc72172189786f"
  };
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

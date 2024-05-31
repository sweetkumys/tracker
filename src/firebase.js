// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAdTsStlxSHFKAAih_HhvAIFwkVDHD3yUg",
    authDomain: "expense-tracker-f65a1.firebaseapp.com",
    projectId: "expense-tracker-f65a1",
    storageBucket: "expense-tracker-f65a1.appspot.com",
    messagingSenderId: "839731391659",
    appId: "1:839731391659:web:ed8d5bf6076cbd5acb9bee",
    measurementId: "G-TJSFV5DLTX"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app); 

export {app}
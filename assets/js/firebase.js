// assets/js/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// Your config (you already have this)
const firebaseConfig = {
  apiKey: "AIzaSyBRc4hwNm2yyWyY0bzi3ZhDXHvMZDv9dwQ",
  authDomain: "gubw-aa40a.firebaseapp.com",
  projectId: "gubw-aa40a",
  storageBucket: "gubw-aa40a.firebasestorage.app",
  messagingSenderId: "910694640010",
  appId: "1:910694640010:web:96fa17441566ea649a8073",
  measurementId: "G-HEBY959HY2"
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export so other files can use it
export { db, collection, addDoc, getDocs };

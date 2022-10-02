// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDL_n5niy_lXTnI-0iIwOLHVl-ghVp8ZpM",
  authDomain: "angka-8c103.firebaseapp.com",
  projectId: "angka-8c103",
  storageBucket: "angka-8c103.appspot.com",
  messagingSenderId: "934764443335",
  appId: "1:934764443335:web:f33e4c2e0578c628ceb0e2",
  measurementId: "G-GTK2913CDN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}
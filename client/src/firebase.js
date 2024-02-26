// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "my-blog-app-2895a.firebaseapp.com",
  projectId: "my-blog-app-2895a",
  storageBucket: "my-blog-app-2895a.appspot.com",
  messagingSenderId: "64759284209",
  appId: "1:64759284209:web:1c2efb24863aa1dc868450"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
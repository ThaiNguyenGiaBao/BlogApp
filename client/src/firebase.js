// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import dotenv from 'dotenv';
// dotenv.config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDug3y2VBE3fCl2F099nLUGlVf6qFWwdME",
  authDomain: "blog-f3876.firebaseapp.com",
  projectId: "blog-f3876",
  storageBucket: "blog-f3876.appspot.com",
  messagingSenderId: "114177348397",
  appId: "1:114177348397:web:8fee65efbc459a1853b9a4",
  measurementId: "G-59RHL0KE8Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


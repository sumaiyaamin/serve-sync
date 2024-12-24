// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCj9jRtx2GLrrNo4xeCNeZe5DJ13liQkoU",
  authDomain: "serve-sync.firebaseapp.com",
  projectId: "serve-sync",
  storageBucket: "serve-sync.firebasestorage.app",
  messagingSenderId: "585016723766",
  appId: "1:585016723766:web:5c5e318d22430a6f14cb97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
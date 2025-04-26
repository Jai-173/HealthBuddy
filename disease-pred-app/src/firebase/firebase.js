// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAVNMqBUFj9lWAWC88XuWV0NNiK6vDLYTM",
  authDomain: "healthbuddy-c9f0f.firebaseapp.com",
  projectId: "healthbuddy-c9f0f",
  storageBucket: "healthbuddy-c9f0f.firebasestorage.app",
  messagingSenderId: "209335623823",
  appId: "1:209335623823:web:04146ca9b74389ba6810fa",
  measurementId: "G-S606M68ZJC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { app, auth, googleProvider };

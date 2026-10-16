
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHHRenkhlfklIHOBonyIjAUCXAhX72VHc",
  authDomain: "giuplegiaoxuthaian.firebaseapp.com",
  projectId: "giuplegiaoxuthaian",
  storageBucket: "giuplegiaoxuthaian.firebasestorage.app",
  messagingSenderId: "758206140845",
  appId: "1:758206140845:web:0a16d09ac6ec9123bf9124"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

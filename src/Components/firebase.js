import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyDKHA6ZmllEUfjqmQLd0h5ujiPo0bObTc0",
    authDomain: "inconnect-fb444.firebaseapp.com",
    projectId: "inconnect-fb444",
    storageBucket: "inconnect-fb444.appspot.com",
    messagingSenderId: "114710194072",
    appId: "1:114710194072:web:ee8de5852a8995789f2ded"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
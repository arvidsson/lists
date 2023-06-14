import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBnOcRsHiH5qH6IONPyRf8c71UUlyi6UGw",
    authDomain: "lists-app-123.firebaseapp.com",
    projectId: "lists-app-123",
    storageBucket: "lists-app-123.appspot.com",
    messagingSenderId: "987727803556",
    appId: "1:987727803556:web:949d490356e815585de231",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

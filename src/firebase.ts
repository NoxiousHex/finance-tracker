import { DatabaseConfig } from "./utils/interfaces";
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig: DatabaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const historyCollection = collection(db, "history");
const currencyCollection = collection(db, "currency");
const dailyCollection = collection(db, "daily");

export { db, historyCollection, currencyCollection, dailyCollection };

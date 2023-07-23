import { DatabaseConfig } from "./utils/interfaces";
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const { VITE_API_KEY, VITE_PROJECT_ID, VITE_MESSAGING_SENDER_ID, VITE_APP_ID } =
	import.meta.env;

const firebaseConfig: DatabaseConfig = {
	apiKey: VITE_API_KEY,
	authDomain: `${VITE_PROJECT_ID}.firebaseapp.com`,
	projectId: VITE_PROJECT_ID,
	storageBucket: `${VITE_PROJECT_ID}.appspot.com`,
	messagingSenderId: VITE_MESSAGING_SENDER_ID,
	appId: VITE_APP_ID,
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const historyCollection = collection(db, "history");
const currencyCollection = collection(db, "currency");
const dailyCollection = collection(db, "daily");

export { db, historyCollection, currencyCollection, dailyCollection };

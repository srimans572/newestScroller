// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcAflmvDXqpij4lsHbQvBcEzfH0OmpVDc",
  authDomain: "scroller-study.firebaseapp.com",
  projectId: "scroller-study",
  storageBucket: "scroller-study.appspot.com",
  messagingSenderId: "851981711973",
  appId: "1:851981711973:web:a81c4df819510a2cd8648c",
  measurementId: "G-SKW3ECVBYZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const analytics = getAnalytics(app);
export const db = getFirestore(app);
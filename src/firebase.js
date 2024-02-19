import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

//import { signInWithEmailAndPassword } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOtvJUU_WbnXFr5f5q7pRtpkG0sabUVRY",
  authDomain: "sdglibrary-dfc2c.firebaseapp.com",
  projectId: "sdglibrary-dfc2c",
  storageBucket: "sdglibrary-dfc2c.appspot.com",
  messagingSenderId: "561580139043",
  appId: "1:561580139043:web:1706a5e6569a65226c0796",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Define and export the signup function
export const dosignup = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// log in method
export const dologin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};


export const dologout = () => {
  return auth.signOut();
};

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default db;

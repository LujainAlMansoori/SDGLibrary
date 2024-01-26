// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOtvJUU_WbnXFr5f5q7pRtpkG0sabUVRY",
  authDomain: "sdglibrary-dfc2c.firebaseapp.com",
  projectId: "sdglibrary-dfc2c",
  storageBucket: "sdglibrary-dfc2c.appspot.com",
  messagingSenderId: "561580139043",
  appId: "1:561580139043:web:1706a5e6569a65226c0796"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//export default getFirestore();


// Initialize Firestore
const db = getFirestore(app);

export const storage = getStorage(app);

export default db;
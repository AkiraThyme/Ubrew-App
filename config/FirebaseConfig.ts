import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCkAzk4fYTpSGqM98Uscq8qFRlfZD3y2JA",
  authDomain: "ubrew-87291.firebaseapp.com",
  projectId: "ubrew-87291",
  storageBucket: "ubrew-87291.appspot.com",
  messagingSenderId: "84572030172",
  appId: "1:84572030172:web:0b2787931e5ec14989a019",
  measurementId: "G-9VSGRZ99J0"
};


//Initialize Firebase
const app = initializeApp(firebaseConfig);
export const dbff = getFirestore(app);

export { collection, query, where, getDocs };



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2MP2fmKlykBOg_UrDVUQ9qv66GsCXTxI",
  authDomain: "knockknock-8e41d.firebaseapp.com",
  projectId: "knockknock-8e41d",
  storageBucket: "knockknock-8e41d.appspot.com",
  messagingSenderId: "1076360344718",
  appId: "1:1076360344718:web:ae5e430c0132d0fec145df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
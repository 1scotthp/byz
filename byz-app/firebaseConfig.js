import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
//import { connectAuthEmulator } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAMHtNdPWsSISgKbftLw95ZBfHbnfJ7gKg",
    authDomain: "byzantine-2dee1.firebaseapp.com",
    projectId: "byzantine-2dee1",
    storageBucket: "byzantine-2dee1.appspot.com",
    messagingSenderId: "25362819620",
    appId: "1:25362819620:web:3867d892608cfb2cd886b1",
    measurementId: "G-CG5XP29N1M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app);
//const auth = initializeAuth(app);

if (location.hostname === "localhost") {
  //connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, 'localhost', 8082);
  connectFunctionsEmulator(functions, "localhost", 5001);
}

export { app };
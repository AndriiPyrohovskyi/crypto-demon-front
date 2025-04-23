import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAy0wXYbwn9akfxSYSROt3qu8KkmcvzebA",
  authDomain: "crypto-demon.firebaseapp.com",
  projectId: "crypto-demon",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
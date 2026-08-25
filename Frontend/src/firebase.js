import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQPyP3VZNtpl2MYSB_4tfbMdccRu0zhso",
  authDomain: "library-management-syste-e5f4f.firebaseapp.com",
  projectId: "library-management-syste-e5f4f",
  storageBucket: "library-management-syste-e5f4f.firebasestorage.app",
  messagingSenderId: "33025353196",
  appId: "1:33025353196:web:59b5aa5eed410af8fa8cc9",
  measurementId: "G-YXWTBEMVWX",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
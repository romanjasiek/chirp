import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCIZ5ToKwRvZ9EFXboWMuE2gUdg8zpv2Kg",
    authDomain: "chirp-82fb0.firebaseapp.com",
    projectId: "chirp-82fb0",
    storageBucket: "chirp-82fb0.appspot.com",
    messagingSenderId: "374894814411",
    appId: "1:374894814411:web:1a3cd1bb9de5e6b497e74e"
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore();
  const storage = getStorage();
  
  export default app;
  export { db, storage };
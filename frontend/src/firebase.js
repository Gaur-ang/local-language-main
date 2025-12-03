import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your Firebase config from Step 8.4
const firebaseConfig = {
  apiKey: "AIzaSyA7hJEtIEqOHxzrdsGo2lTUMTM83AEkGGk",
  authDomain: "local-language-e2737.firebaseapp.com",
  projectId: "local-language-e2737",
  storageBucket: "local-language-e2737.firebasestorage.app",
  messagingSenderId: "510957096246",
  appId: "1:510957096246:web:9afdc33d84fb002c667797"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
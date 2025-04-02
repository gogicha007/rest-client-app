import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { RequestData } from '@/types/request';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

const register = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const logout = () => {
  return signOut(auth);
};

const saveRequestData = async (userId: string, requestData: RequestData) => {
  console.log(userId, requestData);
  try {
    const docRef = await addDoc(
      collection(db, 'users', userId, 'requests'),
      requestData
    );
    console.log('Request data saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving request data:', error);
    throw error;
  }
};

const getRequestHistory = async (userId: string) => {
  try {
    const requestsRef = collection(db, 'users', userId, 'requests');
    const q = query(requestsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    console.log('querySnapshot', querySnapshot);

    const history = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      url: doc.data().url,
      ...doc.data(),
    }));
    return history;
  } catch (error) {
    console.error('Error fetching request history:', error);
    throw error;
  }
};

export {
  app,
  auth,
  db,
  register,
  login,
  logout,
  saveRequestData,
  getRequestHistory,
};

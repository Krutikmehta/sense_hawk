// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';
import {getFirestore} from 'firebase/firestore';
import Config from 'react-native-config';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: Config.API_KEY,
  authDomain: Config.AUTH_DOMAIN,
  projectId: Config.PROJECT_ID,
  storageBucket: Config.STORAGE_BUCKET,
  messagingSenderId: Config.MESSAGING_SENDER_ID,
  appId: Config.APP_ID,
  databaseURL: Config.DATABASE_URL,
  measurementId: Config.ME,
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const firestore = getFirestore(app);

export {db, firestore};

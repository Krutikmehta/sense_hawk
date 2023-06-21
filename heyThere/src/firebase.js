// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';
import {getFirestore} from 'firebase/firestore';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: 'AIzaSyCnyUZkTq-_OcDNVHVSShBG84fgCDc6-Ws',
  authDomain: 'sensehawk-84593.firebaseapp.com',
  projectId: 'sensehawk-84593',
  storageBucket: 'sensehawk-84593.appspot.com',
  messagingSenderId: '536084258186',
  appId: '1:536084258186:web:ddccbe1a8328fae604fc73',
  databaseURL: 'https://sensehawk-84593-default-rtdb.firebaseio.com/',
  measurementId: 'G-0W1Y3P1R80',
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const firestore = getFirestore(app);

export {db, firestore};

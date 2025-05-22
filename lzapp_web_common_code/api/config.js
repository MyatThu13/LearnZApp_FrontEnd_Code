import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/functions";
import "firebase/compat/firestore";
import "firebase/compat/storage";
//import { FIREBASE_PROJECT } from "../../app_constant";

const FIREBASE_PROJECT = `${process.env.REACT_APP_FIREBASE_PROJECT}`;

const firebaseConfig_learnzapp_test = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY_LZ_TEST}`,
  authDomain: "learnzapp-test.firebaseapp.com",
  projectId: "learnzapp-test",
  storageBucket: "learnzapp-test.appspot.com",
  messagingSenderId: "583000286226",
  appId:
    "1:583000286226:web:3a9a1c8a06e325df0fa4cb1:583000286226:web:3a9a1c8a06e325df0fa4cb",
  measurementId: "G-WQH86P90XZ",
};
// Project: Learnzapp
const firebaseConfig_learnzapp_1 = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY_LZ_1}`,
  authDomain: "lsat-b6833.firebaseapp.com",
  databaseURL: "https://lsat-b6833.firebaseio.com",
  projectId: "lsat-b6833",
  storageBucket: "lsat-b6833.appspot.com",
  messagingSenderId: "553021261514",
  appId: "1:553021261514:web:86d5d36ca53e78eb941633",
  measurementId: "G-EJF2F7HYGW",
};

// Project: learnzapp-2
const firebaseConfig_learnzapp_2 = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY_LZ_2}`,
  authDomain: "learnzapp-2.firebaseapp.com",
  projectId: "learnzapp-2",
  storageBucket: "learnzapp-2.appspot.com",
  messagingSenderId: "921783555239",
  appId: "1:921783555239:web:db32c051a773618892b782",
  measurementId: "G-S4C6QWK9GY",
};
console.log("FIREBASE_PROJECT", FIREBASE_PROJECT);
const config =
  FIREBASE_PROJECT === "learnzapp-1"
    ? firebaseConfig_learnzapp_1
    : FIREBASE_PROJECT === "learnzapp-2"
    ? firebaseConfig_learnzapp_2
    : firebaseConfig_learnzapp_test;

//console.log("config", config);
firebase.initializeApp(config);
const app = firebase.app;
const auth = firebase.auth;
const firestore = firebase.firestore;
const storage = firebase.storage;
const functions = firebase.functions;
export { auth, firestore, storage, functions, app };

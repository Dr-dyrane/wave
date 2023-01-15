import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import firebase from "firebase/firestore";
{
  /*import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";*/
}
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";

// Your web app's Firebase configuration
const firebaseConfig = {
  databaseURL: "https://wave-by-dyrane.nam5.firebaseio.com",
  apiKey: "AIzaSyBiPKRPTw_U39gnMYHQ9Hsk2-YFsb9knfA",
  authDomain: "wave-by-dyrane.firebaseapp.com",
  projectId: "wave-by-dyrane",
  storageBucket: "wave-by-dyrane.appspot.com",
  messagingSenderId: "459228911500",
  appId: "1:459228911500:web:1c41066b5dae9d2b1128a9",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
{
  /*let app;
if (firebase.apps.length === 0) {
  //app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}*/
}

//const db = app.firestore();
//const auth = firebase.auth();
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export { auth, db };

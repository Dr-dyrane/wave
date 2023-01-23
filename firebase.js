import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import firebase from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBiPKRPTw_U39gnMYHQ9Hsk2-YFsb9knfA",
  authDomain: "wave-by-dyrane.firebaseapp.com",
  projectId: "wave-by-dyrane",
  storageBucket: "wave-by-dyrane.appspot.com",
  messagingSenderId: "459228911500",
  appId: "1:459228911500:web:1c41066b5dae9d2b1128a9",
};


const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
const storage = getStorage(app);

export { auth, db, storage };

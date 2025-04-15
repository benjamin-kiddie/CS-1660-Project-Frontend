import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";

const config = {
  apiKey: "AIzaSyDnpCqWe9AB0cerTUokyI2EMGs4JCQYoGI",
  authDomain: "scufftube-video-platform.firebaseapp.com",
};

const app = initializeApp(config);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

export { auth };

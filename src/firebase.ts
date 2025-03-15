import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
  apiKey: "AIzaSyDnpCqWe9AB0cerTUokyI2EMGs4JCQYoGI",
  authDomain: "scufftube-video-platform.firebaseapp.com",
};

const app = initializeApp(config);
const auth = getAuth(app);

export { auth };

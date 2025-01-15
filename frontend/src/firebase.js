// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7OeD301l0nKucSG3nhxYf_lracvhAjqg",
  authDomain: "inventory-management-app-b61ce.firebaseapp.com",
  projectId: "inventory-management-app-b61ce",
  storageBucket: "inventory-management-app-b61ce.appspot.com",
  messagingSenderId: "1030405395904",
  appId: "1:1030405395904:web:9fa4fb76d58016fe696425",
  measurementId: "G-XKEMK29WKF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export { firestore };
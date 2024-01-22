// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'blog-app-f79cc.firebaseapp.com',
  projectId: 'blog-app-f79cc',
  storageBucket: 'blog-app-f79cc.appspot.com',
  messagingSenderId: '259695407072',
  appId: '1:259695407072:web:f5fce3a2ccc1c9f3894585',
  measurementId: 'G-1MGC9H58ME',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)


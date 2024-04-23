import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCVu6OtQSlnJzRI6gcDnlnj3QbWX6BY01U",
  authDomain: "strawhatcoders-c1028.firebaseapp.com",
  databaseURL: "https://strawhatcoders-c1028-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "strawhatcoders-c1028",
  storageBucket: "strawhatcoders-c1028.appspot.com",
  messagingSenderId: "1073430107906",
  appId: "1:1073430107906:web:e23a1a7ebe272b1936941b",
  measurementId: "G-J5RHT0X7F4"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


export {db};
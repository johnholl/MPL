import Firebase from "firebase";

let firebaseConfig = {
    apiKey: "AIzaSyDpswWdsUJTIcJlwo1R1QLK2Wt792a7AuY",
    authDomain: "awesomeproject-fa189.firebaseapp.com",
    databaseURL: "https://awesomeproject-fa189.firebaseio.com",
    projectId: "awesomeproject-fa189",
    storageBucket: "awesomeproject-fa189.appspot.com",
    messagingSenderId: "1076752292868",
    appId: "1:1076752292868:web:a5fd7a5af770b5f02ce951",
    measurementId: "G-K8JWMCP192"
};

const app = Firebase.initializeApp(firebaseConfig);
export const db = app.database();
export const storage = app.storage();
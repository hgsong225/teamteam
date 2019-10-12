import firebase from "firebase/app";
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyDIk1JtnbY3_ev2RvAUsLlrSQBM5lQfGvU",
    authDomain: "teamteam-4f863.firebaseapp.com",
    databaseURL: "https://teamteam-4f863.firebaseio.com",
    projectId: "teamteam-4f863",
    storageBucket: "teamteam-4f863.appspot.com",
    messagingSenderId: "858613108263"
  };

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
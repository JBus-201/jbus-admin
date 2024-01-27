import { initializeApp } from 'firebase/app'
// import { getDatabase, ref, onValue } from 'firebase/database'
// import { getAnalytics } from 'firebase/analytics'
import {getFirestore} from 'firebase/firestore'



const firebaseConfig = {
    apiKey: 'AIzaSyBX4oFzliZlumrqX1a9lFOQv4ZYcWJJ0UI',
    authDomain: 'jbus-8f9bf.firebaseapp.com',
    databaseURL: 'https://jbus-8f9bf-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'jbus-8f9bf',
    storageBucket: 'jbus-8f9bf.appspot.com',
    messagingSenderId: '161058040222',
    appId: '1:161058040222:web:ec781325c9122ec15d4e8f',
    measurementId: 'G-Z0WY24WQDB'
  }

  initializeApp(firebaseConfig)
  const db = getFirestore()

  export default db
//   const analytics = getAnalytics(app)
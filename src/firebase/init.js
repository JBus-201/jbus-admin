import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue } from 'firebase/database'

// ... other firebase imports

export const firebaseApp = initializeApp({
  // your application settings
  apiKey: 'AIzaSyBX4oFzliZlumrqX1a9lFOQv4ZYcWJJ0UI',
  authDomain: 'jbus-8f9bf.firebaseapp.com',
  databaseURL: 'https://jbus-8f9bf-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'jbus-8f9bf',
  storageBucket: 'jbus-8f9bf.appspot.com',
  messagingSenderId: '161058040222',
  appId: '1:161058040222:web:ec781325c9122ec15d4e8f',
  measurementId: 'G-Z0WY24WQDB'
})

// used for the database refs
const db = getDatabase()
var location
const locationRef = ref(db, 'Route/1/going/Bus/1/currentLocation');
console.log("locationRef: ", locationRef)
onValue(locationRef, (snapshot) => {
    location = snapshot.val();
    console.log("onValue working")
    console.log(location);
  });

console.log("^^^^^^^^^")
// console.log("db: ", db)
export {location}

// here we can export reusable database references
const todosRef = ref(db, '/Route/1/going/Bus/1/currentLocation') 
console.log("todosRef: ", todosRef)
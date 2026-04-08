/**
 * Firebase Configuration for Utsanova Tech Pvt Ltd
 */

const firebaseConfig = {
  apiKey: "AIzaSyCd4BybrGgEoJirNybviw8YFNHgK5EULeA",
  authDomain: "utsanovawebsite.firebaseapp.com",
  projectId: "utsanovawebsite",
  storageBucket: "utsanovawebsite.firebasestorage.app",
  messagingSenderId: "670590734692",
  appId: "1:670590734692:web:cf43d3d9ceed17d220ea71"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Auth persistence - keep user signed in across browser sessions
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
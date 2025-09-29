const firebaseConfig = {
  apiKey: "AIzaSyCzzfz_piyPu4TJMUtmHIOA5j0Yl9ZjIZw",
  authDomain: "coffee-house-a65b4.firebaseapp.com",
  databaseURL: "https://coffee-house-a65b4-default-rtdb.firebaseio.com",
  projectId: "coffee-house-a65b4",
  storageBucket: "coffee-house-a65b4.firebasestorage.app",
  messagingSenderId: "214964009417",
  appId: "1:214964009417:web:717a4f7189ae58b8dc5018",
  measurementId: "G-W5TYF380FM"
};
// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore(); // Для будущего использования
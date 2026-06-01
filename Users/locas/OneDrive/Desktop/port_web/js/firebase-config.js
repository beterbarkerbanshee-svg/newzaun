// Firebase Configuration
// This file contains sensitive Firebase configuration
// In production, consider using environment variables or a backend proxy
const firebaseConfig = {
    apiKey: "AIzaSyC6JxLzhNR5O9rggtyucTbY7DFGWpBnf2w",
    authDomain: "zaun-tech.firebaseapp.com",
    projectId: "zaun-tech",
    storageBucket: "zaun-tech.firebasestorage.app",
    messagingSenderId: "1049632365222",
    appId: "1:1049632365222:web:b2bc3e0ab686018676b267"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Set persistence to LOCAL
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch(function(error) {
        console.error("Error setting persistence:", error);
    });

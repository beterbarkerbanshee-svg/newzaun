// Unified Firebase SDK Loader
// This file loads all required Firebase SDKs to avoid duplication across pages

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadCss(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

// Global function to initialize Firebase and set global variables
window.initializeFirebaseAndGlobals = async function() {
  const firebaseConfig = {
    apiKey: "AIzaSyC6JxLzhNR5O9rggtyucTbY7DFGWpBnf2w",
    authDomain: "zaun-tech.firebaseapp.com",
    projectId: "zaun-tech",
    storageBucket: "zaun-tech.firebasestorage.app",
    messagingSenderId: "1049632365222",
    appId: "1:1049632365222:web:b2bc3e0ab686018676b267"
  };

  if (window.firebase && !firebase.apps.length) {
    console.log('Initializing Firebase in firebase-loader.js');
    firebase.initializeApp(firebaseConfig);
    window.firebaseAuth = firebase.auth();
    window.firebaseDB = firebase.firestore();

    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        console.log('Persistence set to LOCAL in firebase-loader.js');
      })
      .catch(function(error) {
        console.error("Error setting persistence in firebase-loader.js:", error);
      });
  } else if (window.firebase && firebase.apps.length) {
    console.log('Firebase already initialized, skipping initialization in firebase-loader.js');
    window.firebaseAuth = firebase.auth();
    window.firebaseDB = firebase.firestore();
  }
};

Promise.all([
  loadScript('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js'),
  loadScript('https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js'),
  loadScript('https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js'),
  loadScript('https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.js'),
  loadCss('https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.css')
]).then(async () => {
  console.log('All Firebase SDKs and UI loaded.');
  console.log('Checking firebase object:', typeof firebase, firebase);
  if (firebase && typeof firebase.auth === 'function') {
    console.log('firebase.auth is available.');
  } else {
    console.error('firebase.auth is NOT available after loading.', firebase);
  }
  // Call the global initialization function once all scripts are loaded
  await window.initializeFirebaseAndGlobals();
  // Now that Firebase is initialized, trigger the script.js DOMContentLoaded
  document.dispatchEvent(new Event('firebaseInitialized'));
}).catch(error => {
  console.error("Error loading Firebase SDKs or UI:", error);
});

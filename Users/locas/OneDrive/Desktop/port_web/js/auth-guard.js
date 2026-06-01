// Auth Guard - Protects routes that require authentication
// This script checks if user is authenticated before allowing access to protected pages

// Wait for Firebase to load
document.addEventListener('DOMContentLoaded', function() {
    // Check if Firebase is loaded
    const checkFirebaseAndAuth = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.auth) {
            clearInterval(checkFirebaseAndAuth);
            console.log('Firebase loaded successfully');
            protectRoute();
        }
    }, 100);
});

function isProtectedPage() {
    // Add protected pages here
    const protectedPages = ['dashboard.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    return protectedPages.includes(currentPage);
}

function protectRoute() {
    if (!isProtectedPage()) {
        return; // Not a protected page, no action needed
    }

    console.log('Protecting route for:', window.location.pathname);

    // Check if Firebase is initialized, if not, initialize it
    if (!firebase.apps.length) {
        console.log('Firebase not initialized, initializing...');
        const firebaseConfig = {
            apiKey: "AIzaSyC6JxLzhNR5O9rggtyucTbY7DFGWpBnf2w",
            authDomain: "zaun-tech.firebaseapp.com",
            projectId: "zaun-tech",
            storageBucket: "zaun-tech.firebasestorage.app",
            messagingSenderId: "1049632365222",
            appId: "1:1049632365222:web:b2bc3e0ab686018676b267"
        };
        firebase.initializeApp(firebaseConfig);
        
        // Set persistence to LOCAL to prevent automatic logout
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                console.log('Persistence set to LOCAL');
            })
            .catch(function(error) {
                console.error("Error setting persistence:", error);
            });
    }

    // Check authentication state
    firebase.auth().onAuthStateChanged(function(user) {
        console.log('Auth state changed, user:', user ? user.email : 'null');
        if (!user) {
            // User is not authenticated, redirect to login
            console.log('User not authenticated, redirecting to login');
            // Save the intended destination for redirect after login
            const currentPath = window.location.pathname;
            sessionStorage.setItem('redirectAfterLogin', currentPath);
            window.location.href = 'login.html';
        } else {
            // User is authenticated, allow access
            console.log('User authenticated:', user.email);
            
            // Optional: Check if user has the required role/permissions
            // You can add custom claims or role checks here
        }
    });
}

// Export function to manually check auth state (for use in other scripts)
function checkAuthState() {
    return new Promise((resolve, reject) => {
        if (typeof firebase === 'undefined' || !firebase.auth) {
            reject(new Error('Firebase not loaded'));
            return;
        }
        
        firebase.auth().onAuthStateChanged(function(user) {
            resolve(user);
        });
    });
}

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD2MP2fmKlykBOg_UrDVUQ9qv66GsCXTxI",
    authDomain: "knockknock-8e41d.firebaseapp.com",
    projectId: "knockknock-8e41d",
    storageBucket: "knockknock-8e41d.appspot.com",
    messagingSenderId: "1076360344718",
    appId: "1:1076360344718:web:ae5e430c0132d0fec145df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

document.querySelector('.login-button').addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#email-login-input').value;
    const password = document.querySelector('#password-login-input').value;
    const auth = getAuth();

    try {
        const userCredential = await auth.signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        

        // Store ID token in localStorage
        localStorage.setItem('idToken', idToken);

        // Reload page after logging in
        window.location.reload();
    } catch (error) {
        console.error('Error logging in:', error);
    }
});

document.querySelector('.header-logout-button').addEventListener('click', async (event) => {
    event.preventDefault();

    // Clear ID token from localStorage
    localStorage.removeItem('idToken');

    // Redirect to login page after logging out
    window.location.href = '/login';
});

// Get references to the containers
const loginContainer = document.querySelector('.login-container');
const landingPageContainer = document.querySelector('.landing-page-container');

// Listen for authentication state changes
onAuthStateChanged(auth, user => {
    if (user) {
        // User is signed in, hide the login container and show the landing page container
        loginContainer.style.display = 'none';
        landingPageContainer.style.display = 'block';
    } else {
        // User is signed out, show the login container and hide the landing page container
        loginContainer.style.display = 'block';
        landingPageContainer.style.display = 'none';
    }
});
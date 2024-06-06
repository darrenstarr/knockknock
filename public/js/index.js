import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { initializeApp } from 'firebase/app';
 import { getFunctions } from 'firebase/functions';

const functions = getFunctions(app);

const firebaseConfig = {
    apiKey: "AIzaSyD2MP2fmKlykBOg_UrDVUQ9qv66GsCXTxI",
    authDomain: "knockknock-8e41d.firebaseapp.com",
    projectId: "knockknock-8e41d",
    storageBucket: "knockknock-8e41d.appspot.com",
    messagingSenderId: "1076360344718",
    appId: "1:1076360344718:web:ae5e430c0132d0fec145df"
};

const loginContainer = document.querySelector('.login-container');
const signupContainer = document.querySelector('.signup-container');
const signupRedirectionButton = document.querySelector('.signup-redirection');
const landingPageContainer = document.querySelector('.landing-page-container');
const signupButton = document.querySelector('.signup-button');
const logoutButton = document.querySelector('.header-logout-button');
const loginButton = document.querySelector('.login-button');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

loginButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#email-login-input').value;
    const password = document.querySelector('#password-login-input').value;
    const auth = getAuth();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        // Store ID token in localStorage
        localStorage.setItem('idToken', idToken);

        // Reload page after logging in
        window.location.reload();
    } catch (error) {
        console.error('Error logging in:', error);
    }
});

logoutButton.addEventListener('click', async (event) => {
    auth.signOut();

    event.preventDefault();

    // Clear ID token from localStorage
    localStorage.removeItem('idToken');

    // Redirect to login page after logging out
    window.location.href = '/';
});

// Listen for authentication state changes
onAuthStateChanged(auth, user => {
    const displayNameDiv = document.querySelector('.landing-header-namedisplay');

    if (user) {
        // User is signed in, hide the login container and show the landing page container
        loginContainer.style.display = 'none';
        landingPageContainer.style.display = 'block';

        // Set the value of the landing-header-namedisplay div to the display name of the user
        displayNameDiv.textContent = user.displayName;

    } else {
        // User is signed out, show the login container and hide the landing page container
        loginContainer.style.display = 'block';
        landingPageContainer.style.display = 'none';

        displayNameDiv.textContent = "";
    }
});

// Add click event listener to the button
signupRedirectionButton.addEventListener('click', () => {
    // Hide the login container and show the signup container
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
});

signupButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const firstname = document.querySelector('#firstname-input').value;
    const lastname = document.querySelector('#lastname-input').value;
    const email = document.querySelector('#email-signup-input').value;
    const password = document.querySelector('#password-signup-input').value;

    // Validate the fields
    // Validate the fields
    if (!firstname || !lastname || !email || !password) {
        alert('All fields are required');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update the user's profile with the combined first and last names
        await updateProfile(user, {
            displayName: `${firstname} ${lastname}`
        });

        // Get the ID token
        const idToken = await user.getIdToken();

        // Log the token to console
        console.log('ID token:', idToken);

        // Call the /api/registerNewUser endpoint
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}` // Send the token as a bearer token
            },
            body: JSON.stringify({
                firstName: firstname,
                lastName: lastname
            })
        });

        if (response.status === 200) {
            // User was registered successfully
            alert('User has been created successfully');
            window.location.href = '/'; // Redirect to the home page
        } else {
            // Something went wrong
            alert('Something went wrong');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
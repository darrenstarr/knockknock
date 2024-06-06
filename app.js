const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config.js');
const firebase = require('./firebase.js');
const path = require('path');
const admin = require('firebase-admin');
const cookieParser = require('cookie-parser');
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const compiler = webpack(config);

const expressApp = express();
expressApp.use(express.json());
expressApp.use(cookieParser());

// Serve static files from the /public directory
expressApp.use(express.static(path.join(__dirname, 'public')));

expressApp.use(
    webpackDevMiddleware(compiler, {
        publicPath: '/',
    })
);
const db = getFirestore();

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


expressApp.use(async (req, res, next) => {
    const idToken = req.headers.authorization?.replace('Bearer ', '');

    if (idToken) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);

            // Attach user to request object
            req.user = decodedToken;

            next();
        } catch (error) {
            res.status(401).send('Invalid ID token');
        }
    } else {
        res.status(401).send('No ID token provided');
    }
});


expressApp.post('/api/user', async (req, res) => {
    // Get the ID token, first name, and last name from the request body
    const { idToken, firstName, lastName } = req.body;

    try {
        const idToken = req.headers.authorization?.replace('Bearer ', '');
        if (idToken) {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            // Create a new record in the "users" collection
            await setDoc(doc(db, "users", decodedToken.uid), {
                admin: false,
                firstName: firstName,
                lastName: lastName
            });

            res.status(200).send('User registered successfully');
        }
        res.status(500).send('Failed to create record');

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

expressApp.listen(3000, function () {
    console.log('App listening on port 3000!\n');
});
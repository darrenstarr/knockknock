import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import config from './webpack.config.js';
import firebase from './firebase.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as admin from 'firebase-admin';
import cookieParser from 'cookie-parser';


const __dirname = dirname(fileURLToPath(import.meta.url));

const compiler = webpack(config);

const app = express();
app.use(express.json());
app.use(cookieParser());

// Serve static files from the /public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    webpackDevMiddleware(compiler, {
        publicPath: '/',
    })
);

app.use(async (req, res, next) => {
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

app.listen(3000, function () {
    console.log('App listening on port 3000!\n');
});
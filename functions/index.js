/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const logger = require("firebase-functions/logger");
const {onCall, HttpsError} = require("firebase-functions/v2/https");


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// [START v2allAdd]
// [START v2addFunctionTrigger]
// Adds two numbers to each other.
exports.addnumbers = onCall((request) => {
    logger.info("Hello logs!", {structuredData: true});
    // [END v2addFunctionTrigger]
    // [START v2readAddData]
    // Numbers passed from the client.
    const firstNumber = request.data.firstNumber;
    const secondNumber = request.data.secondNumber;
    // [END v2readAddData]

    // [START v2addHttpsError]
    // Checking that attributes are present and are numbers.
    if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new HttpsError("invalid-argument", "The function must be called " +
              "with two arguments \"firstNumber\" and \"secondNumber\" which " +
              "must both be numbers.");
    }
    // [END v2addHttpsError]

    // [START v2returnAddData]
    // returning result.
    return {
      firstNumber: firstNumber,
      secondNumber: secondNumber,
      operator: "+",
      operationResult: firstNumber + secondNumber,
    };
    // [END v2returnAddData]
  });
  // [END v2allAdd]



// Imports the Firebase application initializer from the SDK so the app can connect to Firebase.
import { initializeApp } from "firebase/app";
// Imports the Firestore client from the SDK so the app can read and write database data.
import { getFirestore } from "firebase/firestore";

// Imports the analytics helper only if the app later decides to use Firebase analytics.
// import { getAnalytics } from "firebase/analytics";
// Lists the SDKs the project may eventually need for other Firebase services.
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Stores the app's Firebase connection settings from environment variables instead of hardcoding secrets.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY, // Reads the Firebase API key from environment variables for secure configuration.
  authDomain: process.env.FIREBASE_AUTHDOMAIN, // Reads the Firebase Auth domain used by the app.
  projectId: process.env.FIREBASE_PROJECTID, // Reads the Firebase project ID to identify the correct backend.
  storageBucket: process.env.FIREBASE_STORAGEBUCKET, // Reads the Cloud Storage bucket name if the app uses file storage.
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID, // Reads the Firebase messaging sender ID for push configuration.
  appId: process.env.FIREBASE_APPID, // Reads the Firebase app ID for the configured web app.
  measurementId: process.env.FIREBASE_MEASUREMENTID // Reads the optional analytics measurement ID if analytics is enabled.
};

// Initializes the Firebase application using the configuration object above.
const firebaseApp = initializeApp(firebaseConfig);
// Analytics is intentionally not configured in this app for now.
// const analytics = getAnalytics(app);

// Creates the Firestore database client from the initialized Firebase app.
const db = getFirestore(firebaseApp);

// Exports the database client so other JavaScript modules can query Firestore.
export { db };
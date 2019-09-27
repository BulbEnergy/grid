export const config = {
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'localhost',
    databaseURL: process.env.REACT_APP_FIREBASE_DB_URL || 'ws://localhost:5000',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_ID,
  },
  branding: {
    enabled: process.env.REACT_APP_BRANDING_ENABLED === '1' || false,
    logoSrc: process.env.REACT_APP_BRANDING_LOGO,
  },
};

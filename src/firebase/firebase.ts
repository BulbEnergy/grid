import 'firebase/auth';
import 'firebase/database';
import { config } from '../config';
import { FirebaseLocalAuth, FirebaseAuth, FirebaseAuthWrapper } from './auth';
import { FirebaseCoreWrapper, FirebaseCore } from './core';

interface FirebaseWrapper extends FirebaseAuthWrapper, FirebaseCoreWrapper {}

const Firebase: FirebaseWrapper = Object.assign(
  FirebaseCore,
  config.firebase.authDomain === 'localhost' ? FirebaseLocalAuth : FirebaseAuth,
);

export default Firebase;

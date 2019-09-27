import { auth, database } from 'firebase/app';
import _ from 'lodash';

export interface FirebaseAuthWrapper {
  getUserId: () => string | undefined;
  login: () => Promise<string>;
}

const FirebaseLocalAuth: FirebaseAuthWrapper = {
  login(): Promise<string> {
    return Promise.resolve('localUser');
  },

  getUserId(): string | undefined {
    return 'localUser';
  },
};

const FirebaseAuth: FirebaseAuthWrapper = {
  login(): Promise<string> {
    return new Promise((resolve, reject) => {
      auth()
        .signInAnonymously()
        .catch(() => {
          reject(new Error('problem logging in'));
        });

      auth().onAuthStateChanged(user => {
        if (user) {
          const db = database().ref(`users/${user.uid}`);
          db.update({ uid: user.uid }).then(() => resolve(user.uid));
        }
      }, reject);
    });
  },

  getUserId(): string | undefined {
    return _.get(auth(), 'currentUser.uid', undefined);
  },
};

export { FirebaseLocalAuth, FirebaseAuth };

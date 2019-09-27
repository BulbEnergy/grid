import React from 'react'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as firebase from '@firebase/testing';
import fs from 'fs';

describe('firebase rules for', () => {
  const databaseName = 'test-db';

  const validLayout = {
    rows: 1,
    cols: 1,
    content: ['a'],
  };

  function unathenticated() {
    return firebase.initializeTestApp({
      databaseName,
    });
  }

  function authenticatedAs(uid: string) {
    return firebase.initializeTestApp({
      databaseName,
      auth: { uid },
    });
  }

  function adminApp() {
    return firebase.initializeAdminApp({ databaseName }).database();
  }

  beforeAll(() => {
    const dbRules: string = fs.readFileSync('database.rules.json', 'utf8');
    firebase.loadDatabaseRules({
      databaseName,
      rules: dbRules,
    });
  });

  beforeEach(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()));

    await adminApp()
      .ref()
      .set(null);
  });

  describe('users', () => {
    it('prevents unathenticated users from reading', async () => {
      // given
      const app = await unathenticated();

      // when / then
      await firebase.assertFails(
        app
          .database()
          .ref('users')
          .child('me')
          .once('value'),
      );
    });

    it('allows authenticated users to read their own data', async () => {
      // given
      const app = await authenticatedAs('me');

      // when / then
      await firebase.assertSucceeds(
        app
          .database()
          .ref('users')
          .child('me')
          .once('value'),
      );
    });

    it('prevents authenticated users from reading other users data', async () => {
      // given
      const app = await authenticatedAs('me');

      // when / then
      await firebase.assertFails(
        app
          .database()
          .ref('users')
          .child('not-me')
          .once('value'),
      );
    });

    it('allows authenticated user to write own data', async () => {
      // given
      const app = await authenticatedAs('me');

      // when / then
      await firebase.assertSucceeds(
        app
          .database()
          .ref('users')
          .child('me')
          .update({ uid: 'me' }),
      );
    });

    it('prevents authenticated user from writing poorly formatted data', async () => {
      // given
      const app = await authenticatedAs('me');

      // when / then
      await firebase.assertFails(
        app
          .database()
          .ref('users')
          .child('me')
          .update({ other: 'data' }),
      );
    });

    it('prevents authenticated user from writing other users data', async () => {
      // given
      const app = await authenticatedAs('me');

      // when / then
      await firebase.assertFails(
        app
          .database()
          .ref('users')
          .child('not-me')
          .update({ uid: 'not-me' }),
      );
    });

    it('prevents unauthenticated user from writing other users data', async () => {
      // given
      const app = await unathenticated();

      // when / then
      await firebase.assertFails(
        app
          .database()
          .ref('users')
          .child('me')
          .update({ uid: 'me' }),
      );
    });
  });

  describe('boards', () => {
    it('allows authenticated users to read', async () => {
      // given
      const app = await authenticatedAs('me');

      // when / then
      await firebase.assertSucceeds(
        app
          .database()
          .ref('boards')
          .child('a-board')
          .once('value'),
      );
    });

    it('prevents unauthenticated users from reading', async () => {
      // given
      const app = await unathenticated();

      // when / then
      await firebase.assertFails(
        app
          .database()
          .ref('boards')
          .child('a-board')
          .once('value'),
      );
    });

    it('allows authenticated user to create new board', async () => {
      // given
      const app = await authenticatedAs('me');

      // when / then
      await firebase.assertSucceeds(
        app
          .database()
          .ref('boards')
          .child('a-board')
          .update({
            admin: 'me',
            voting: false,
            layout: validLayout,
          }),
      );
    });

    it('voting must be boolean', async () => {
      // given
      const app = await authenticatedAs('me');

      // when / then
      await firebase.assertFails(
        app
          .database()
          .ref('boards')
          .child('a-board')
          .update({
            admin: 'me',
            voting: 'false',
            layout: validLayout,
          }),
      );
    });

    it('prevents authenticated user from adding additional data', async () => {
      // given
      const app = await authenticatedAs('me');

      // when / then
      await firebase.assertFails(
        app
          .database()
          .ref('boards')
          .child('a-board')
          .update({
            admin: 'me',
            voting: false,
            layout: validLayout,
            other: 'data',
          }),
      );
    });

    it('prevents authenticated user from assigning another user as admin', async () => {
      // given
      const app = await authenticatedAs('me');

      // when / then
      await firebase.assertFails(
        app
          .database()
          .ref('boards')
          .child('a-board')
          .update({
            admin: 'not-me',
            voting: false,
            layout: validLayout,
          }),
      );
    });

    it('prevents authenticated user from setting admin more than once', async () => {
      // given
      const app = await authenticatedAs('me');
      await adminApp()
        .ref('boards')
        .child('a-board')
        .update({
          admin: 'me',
        });

      // when / then
      await firebase.assertFails(
        app
          .database()
          .ref('boards')
          .child('a-board')
          .update({
            admin: 'me',
            voting: false,
            layout: validLayout,
          }),
      );
    });

    it('prevents authenticated user from updating board if not the admin', async () => {
      // given
      const app = await authenticatedAs('me');
      await adminApp()
        .ref('boards')
        .child('a-board')
        .update({
          admin: 'not-me',
        });

      // when / then
      await firebase.assertFails(
        app
          .database()
          .ref('boards')
          .child('a-board')
          .update({
            admin: 'me',
            voting: false,
            layout: validLayout,
          }),
      );
    });

    describe('layout', () => {
      it('prevents columns that are not numbers', async () => {
        // given
        const app = await authenticatedAs('me');

        // when / then
        await firebase.assertFails(
          app
            .database()
            .ref('boards')
            .child('a-board')
            .update({
              admin: 'me',
              voting: false,
              layout: { ...validLayout, cols: 'one' },
            }),
        );
      });

      it('prevents rows that are not numbers', async () => {
        // given
        const app = await authenticatedAs('me');

        // when / then
        await firebase.assertFails(
          app
            .database()
            .ref('boards')
            .child('a-board')
            .update({
              admin: 'me',
              voting: false,
              layout: { ...validLayout, rows: 'one' },
            }),
        );
      });

      it('prevents content longer than 20 characters', async () => {
        // given
        const app = await authenticatedAs('me');

        // when / then
        await firebase.assertFails(
          app
            .database()
            .ref('boards')
            .child('a-board')
            .update({
              admin: 'me',
              voting: false,
              layout: {
                ...validLayout,
                content: ['abcdefghijklmnopqrstuvwxwz'],
              },
            }),
        );
      });

      it('prevents arbitrary data', async () => {
        // given
        const app = await authenticatedAs('me');

        // when / then
        await firebase.assertFails(
          app
            .database()
            .ref('boards')
            .child('a-board')
            .update({
              admin: 'me',
              voting: false,
              layout: { ...validLayout, other: 'data' },
            }),
        );
      });
    });

    describe('voting', () => {
      beforeEach(async () => {
        await adminApp()
          .ref('boards')
          .child('a-board')
          .update({
            admin: 'me',
            voting: false,
            layout: validLayout,
          });
      });

      it('allows admin to update value', async () => {
        // given
        const app = await authenticatedAs('me');

        // when / then
        await firebase.assertSucceeds(
          app
            .database()
            .ref('boards/a-board')
            .child('voting')
            .set(true),
        );
      });

      it('prevents non-admin from updating value', async () => {
        // given
        const app = await authenticatedAs('not-me');

        // when / then
        await firebase.assertFails(
          app
            .database()
            .ref('boards/a-board')
            .child('voting')
            .set(true),
        );
      });

      it('prevents non-boolean values', async () => {
        // given
        const app = await authenticatedAs('me');

        // when / then
        await firebase.assertFails(
          app
            .database()
            .ref('boards/a-board')
            .child('voting')
            .set('true'),
        );
      });
    });

    describe('votes', () => {
      beforeEach(async () => {
        await adminApp()
          .ref('boards')
          .child('a-board')
          .update({
            admin: 'me',
            voting: false,
            layout: validLayout,
          });
      });

      it('allows user to write own vote', async () => {
        // given
        const app = await authenticatedAs('a-user');

        // when / then
        await firebase.assertSucceeds(
          app
            .database()
            .ref('boards/a-board/votes')
            .child('a-user')
            .set({
              x: 0.5,
              y: 0.5,
              emoji: '😊',
            }),
        );
      });

      it('prevents user from updating another users vote', async () => {
        // given
        const app = await authenticatedAs('a-user');

        // when / then
        await firebase.assertFails(
          app
            .database()
            .ref('boards/a-board/votes')
            .child('another-user')
            .set({
              x: 0.5,
              y: 0.5,
              emoji: '😊',
            }),
        );
      });

      it('prevents coordinates that are not numbers', async () => {
        // given
        const app = await authenticatedAs('a-user');

        // when / then
        await firebase.assertFails(
          app
            .database()
            .ref('boards/a-board/votes')
            .child('a-user')
            .set({
              x: 'one',
              y: 0.5,
              emoji: '😊',
            }),
        );
      });

      it('prevents coordinates that are not between 0 and 1', async () => {
        // given
        const app = await authenticatedAs('a-user');

        // when / then
        await firebase.assertFails(
          app
            .database()
            .ref('boards/a-board/votes')
            .child('a-user')
            .set({
              x: 1.5,
              y: 0.5,
              emoji: '😊',
            }),
        );
      });

      it('prevents emoji that are longer than 2 characters', async () => {
        // given
        const app = await authenticatedAs('a-user');

        // when / then
        await firebase.assertFails(
          app
            .database()
            .ref('boards/a-board/votes')
            .child('a-user')
            .set({
              x: 0.5,
              y: 0.5,
              emoji: '😊😊',
            }),
        );
      });

      it('prevents writing arbitrary data', async () => {
        // given
        const app = await authenticatedAs('a-user');

        // when / then
        await firebase.assertFails(
          app
            .database()
            .ref('boards/a-board/votes')
            .child('a-user')
            .set({
              x: 0.5,
              y: 0.5,
              emoji: '😊',
              some: 'data',
            }),
        );
      });
    });
  });
});

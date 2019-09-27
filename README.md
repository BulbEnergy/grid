# GRID

GRID is a collaborative planning and voting tool. It can be used by teams for estimating tasks, establishing consensus and prioritizing work.

## Getting starting

To get started, run:

```
yarn install
```

and

```
yarn start:local
```

This starts a local dev server and a local emulated Firebase server.

To test, run:

```
yarn test:unit
```

## Running with Firebase

GRID is a React app powered by a Firebase realtime database. To host your own version of GRID or develop against a real database you will need to create a [Firebase Project](https://firebase.google.com/) and a [Firebase Realtime Database](https://firebase.google.com/docs/database)

After creating your database, copy the `env.example` file to `.env` and fill in the missing details

```
cp env.example .env
```

You will need to find the following values in your Firebase project and add them to your `.env` file:

| Value         | Location                         |
| ------------- | -------------------------------- |
| `project-id`  | Settings > General > Project ID  |
| `web-api-key` | Settings > General > Web API Key |

GRID uses [anonymous login](https://firebase.google.com/docs/auth/web/anonymous-auth) to enforce [security rules](https://firebase.google.com/docs/database/security) on the database. Anonymous login must be enabled in the Firebase console:

1. Open the 'Authentication' section
2. Select 'Set up sign-in method'
3. Select 'Anonymous' and save

To deploy the security rules to the database, first login to the Firebase CLI:

```
yarn firebase login
```

then select your Firebase project:

```
yarn firebase use <project-id>
```

and finally deploy the rules:

```
yarn deploy:rules
```

To start a local dev server run:

```
yarn start
```

## Testing

To get testing, run:

```
yarn test:unit
```

This will run a subset of the tests which do not require any external dependencies.

In order to test the [security rules](https://firebase.google.com/docs/rules) of the Firebase Realtime Database the [Firebase Emulator](https://firebase.google.com/docs/database/security/test-rules-emulator) must first be installed:

```
yarn firebase setup:emulators:database
```

after installing the emulator, all tests can be run with:

```
yarn test
```

## Linting

```
yarn lint
```

## Building

To create a production build run:

```
yarn build
```

## Deploying

To deploy using [Firebase hosting](https://firebase.google.com/docs/hosting) run:

```
yarn deploy
```

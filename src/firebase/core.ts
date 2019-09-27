import { initializeApp, database } from 'firebase/app';
import { GridContainerProps } from '../grid/GridContainer';
import { config } from '../config';

export interface FirebaseCoreWrapper {
  init: () => void;
  loadGrid: (gridId: string, userId: string) => Promise<GridContainerProps>;
  createBoard: (
    gridId: string,
    userId: string,
    rows: number,
    cols: number,
    content: string[],
  ) => Promise<void>;
  votesDb: (id: string) => firebase.database.Reference;
  votingDb: (id: string) => firebase.database.Reference;
}

const FirebaseCore: FirebaseCoreWrapper = {
  init(): void {
    initializeApp(config.firebase);
  },

  loadGrid(gridId: string, userId: string): Promise<GridContainerProps> {
    return new Promise<GridContainerProps>(resolve => {
      if (gridId === '') {
        resolve();
      } else {
        const db = database().ref(`boards/${gridId}`);
        db.once('value').then(res => {
          if (res.exists()) {
            const grid = res.val();
            const { layout } = grid;

            resolve({
              id: gridId,
              rows: layout.rows,
              cols: layout.cols,
              content: layout.content,
              votes: grid.votes || {},
              voteInProgress: grid.voteInProgress,
              userId,
              userRole: grid.admin === userId ? 'admin' : 'user',
            });
          } else {
            resolve();
          }
        });
      }
    });
  },

  createBoard(
    gridId: string,
    userId: string,
    rows: number,
    cols: number,
    content: string[],
  ) {
    const db = database().ref(`boards/${gridId}`);
    return new Promise<void>(resolve => {
      db.set({
        layout: {
          rows,
          cols,
          content,
        },
        votes: {},
        voting: false,
        admin: userId,
      }).then(resolve);
    });
  },

  votesDb(id: string) {
    return database().ref(`boards/${id}/votes`);
  },

  votingDb(id: string) {
    return database().ref(`boards/${id}/voting`);
  },
};

export { FirebaseCore };

import React, { useState } from 'react';
import nanoid from 'nanoid'; // eslint-disable-line import/no-unresolved
import { Create } from './Create';
import firebase from '../firebase/firebase';

export type GridLayout = '2x2' | '3x3';

const CreateContainer: React.FunctionComponent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const link: string = nanoid(10);

  function create(rows: number, cols: number, content: string[]) {
    setLoading(true);

    const userId = firebase.getUserId();
    if (!userId) {
      throw new Error('User not authenticated!');
    }

    firebase.createBoard(link, userId, rows, cols, content).then(() => {
      window.location.assign(`/${link}`); // TODO: find a better way
    });
  }

  function create3x3Grid() {
    create(3, 3, ['1', '2', '3', '5', '8', '13', '21', '∞', '?']);
  }

  function create2x2Grid() {
    create(2, 2, ['A', 'B', 'C', 'D']);
  }

  function createGrid(layout: GridLayout) {
    switch (layout) {
      case '2x2':
        create2x2Grid();
        break;
      case '3x3':
        create3x3Grid();
        break;
      default:
        throw Error(`Grid layout ${layout} not supported!`);
    }
  }

  return <Create loading={loading} onCreateHandler={createGrid} />;
};

export { CreateContainer };

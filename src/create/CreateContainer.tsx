import React, { useState } from 'react';
import nanoid from 'nanoid'; // eslint-disable-line import/no-unresolved
import { useHistory } from 'react-router-dom';
import { Create } from './Create';
import firebase from '../firebase/firebase';

export type GridLayout = '2x2' | '3x3';

const CreateContainer: React.FunctionComponent = () => {
  const [creating, setCreating] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const history = useHistory();

  async function create(rows: number, cols: number, content: string[]) {
    if (creating) {
      return;
    }
    setCreating(true);

    const gridId: string = nanoid(10);
    const userId: string = await firebase.login();
    const newGrid = await firebase.createBoard(
      gridId,
      userId,
      rows,
      cols,
      content,
    );

    if (newGrid) {
      history.push({
        pathname: `/${gridId}`,
        state: newGrid,
      });
    } else {
      setError(true);
      setCreating(false);
    }
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

  return (
    <Create creating={creating} onCreateHandler={createGrid} error={error} />
  );
};

export { CreateContainer };

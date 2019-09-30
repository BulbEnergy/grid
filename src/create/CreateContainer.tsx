import React from 'react';
import nanoid from 'nanoid'; // eslint-disable-line import/no-unresolved
import { useHistory } from 'react-router-dom';
import { Create } from './Create';
import { NewGridProps } from '../grid/GridLoaderContainer';

export type GridLayout = '2x2' | '3x3';

const CreateContainer: React.FunctionComponent = () => {
  const history = useHistory();

  function create(rows: number, cols: number, content: string[]) {
    const link: string = nanoid(10);
    const newGrid: NewGridProps = {
      rows,
      cols,
      content,
    };
    history.push({
      pathname: `/${link}`,
      state: newGrid,
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

  return <Create onCreateHandler={createGrid} />;
};

export { CreateContainer };

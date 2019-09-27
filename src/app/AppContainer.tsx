import React, { useState } from 'react';
import firebase from '../firebase/firebase';
import { App } from './App';
import { GridContainerProps } from '../grid/GridContainer';

firebase.init();

const AppContainer: React.FunctionComponent = () => {
  // eslint-disable-next-line no-undef
  const gridId: string = window.location.pathname.replace('/', '');
  const [loading, setLoading] = useState<boolean>(true);
  const [grid, setGrid] = useState<GridContainerProps>();

  if (loading) {
    firebase.login().then((userId: string) => {
      firebase.loadGrid(gridId, userId).then((props: GridContainerProps) => {
        setLoading(false);
        setGrid(props);
      });
    });
  }

  return <App loading={loading} gridId={gridId} grid={grid} />;
};

export { AppContainer };

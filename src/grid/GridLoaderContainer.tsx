import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import { GridContainerProps } from './GridContainer';
import firebase from '../firebase/firebase';
import { GridLoader } from './GridLoader';

const GridLoaderContainer: React.FunctionComponent = () => {
  const location: Location = useLocation();
  const [gridProps, setGridProps] = useState<GridContainerProps | undefined>(
    location.state,
  );
  const [loading, setLoading] = useState<boolean>(!gridProps);
  const gridId: string = location.pathname.replace('/', '');

  useEffect(() => {
    const loadGrid = async () => {
      if (!gridProps) {
        const userId = await firebase.login();
        const grid = await firebase.loadGrid(gridId, userId);

        setLoading(false);
        setGridProps(grid);
      }
    };

    loadGrid();
  }, [gridId, gridProps]);

  return <GridLoader loading={loading} grid={gridProps} />;
};

export { GridLoaderContainer };

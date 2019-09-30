import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GridContainerProps } from './GridContainer';
import firebase from '../firebase/firebase';
import { GridLoader } from './GridLoader';

export interface NewGridProps {
  rows: number;
  cols: number;
  content: string[];
}

const GridLoaderContainer: React.FunctionComponent = () => {
  const [gridProps, setGridProps] = useState<GridContainerProps>();
  const [loading, setLoading] = useState<boolean>(true);

  const location = useLocation();
  const gridId: string = location.pathname.replace('/', '');
  const newGridProps: NewGridProps = location.state;

  useEffect(() => {
    const loadGrid = async () => {
      const userId = await firebase.login();
      const grid = await firebase.loadGrid(gridId, userId);

      if (grid) {
        setLoading(false);
        setGridProps(grid);
      } else if (newGridProps) {
        const { rows, cols, content } = newGridProps;
        const newGrid = await firebase.createBoard(
          gridId,
          userId,
          rows,
          cols,
          content,
        );

        setLoading(false);
        setGridProps(newGrid);
      } else {
        setLoading(false);
        setGridProps(undefined);
      }
    };

    loadGrid();
  }, [gridId, newGridProps]);

  return <GridLoader loading={loading} grid={gridProps} />;
};

export { GridLoaderContainer };

import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { GridContainerProps } from './GridContainer';
import firebase from '../firebase/firebase';
import { GridLoader } from './GridLoader';

export interface NewGridProps {
  rows: number;
  cols: number;
  content: string[];
}

const GridLoaderContainer: React.FunctionComponent<RouteComponentProps> = (
  props: RouteComponentProps,
) => {
  const [gridProps, setGridProps] = useState<GridContainerProps>();
  const [loading, setLoading] = useState<boolean>(true);

  const { location } = props;
  const gridId: string = window.location.pathname.replace('/', '');
  const newGridProps: NewGridProps = location ? location.state : undefined;

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

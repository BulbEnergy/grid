import React from 'react';
import { GridContainerProps, GridContainer } from './GridContainer';
import { Loading } from '../Loading';
import { Error } from '../Error';

interface GridLoaderProps {
  loading: boolean;
  grid?: GridContainerProps;
}

const GridLoader: React.FunctionComponent<GridLoaderProps> = (
  props: GridLoaderProps,
) => {
  const { loading, grid } = props;

  if (loading) {
    return <Loading />;
  }

  if (grid) {
    return <GridContainer {...grid} />;
  }

  return <Error message="We can't load that grid&nbsp;&nbsp;💔" />;
};

export { GridLoader };

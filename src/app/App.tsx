import React from 'react';
import styled from 'styled-components';
import { CreateContainer } from '../create/CreateContainer';
import { Error } from '../Error';
import { Loading } from '../Loading';
import { GridContainer, GridContainerProps } from '../grid/GridContainer';
import { Footer } from '../shared/Footer';

const AppLayout = styled.div`
  flex-direction: column;
  display: flex;
  width: 100%;
  height: 100%;
`;

export interface AppProps {
  loading: boolean;
  gridId: string;
  grid?: GridContainerProps;
}

function withFooter(component: React.ReactNode) {
  return (
    <AppLayout>
      {component}
      <Footer />
    </AppLayout>
  );
}

const App: React.FunctionComponent<AppProps> = (props: AppProps) => {
  if (props.loading) {
    return withFooter(<Loading />);
  }

  if (props.gridId !== '') {
    if (props.grid) {
      return withFooter(<GridContainer {...props.grid} />);
    }
    return withFooter(<Error message={"We can't find that grid"} />);
  }

  return withFooter(<CreateContainer />);
};

export { App };

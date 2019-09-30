import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components';
import firebase from '../firebase/firebase';
import { CreateContainer } from '../create/CreateContainer';
import { GridLoaderContainer } from '../grid/GridLoaderContainer';
import { Footer } from '../shared/Footer';

firebase.init();

const AppLayout = styled.div`
  flex-direction: column;
  display: flex;
  width: 100%;
  height: 100%;
`;

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <AppLayout>
        <Route exact path="/">
          <CreateContainer />
        </Route>
        <Route path="/:gridId">
          <GridLoaderContainer />
        </Route>
        <Footer />
      </AppLayout>
    </Router>
  );
};

export { App };

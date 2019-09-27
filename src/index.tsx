import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ThemeProvider } from 'styled-components';
import { AppContainer } from './app/AppContainer';
import { DefaultTheme } from './theme';

// eslint-disable-next-line no-undef
ReactDOM.render(
  <ThemeProvider theme={DefaultTheme}>
    <AppContainer />
  </ThemeProvider>,
  document.getElementById('root'),
);

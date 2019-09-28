import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ThemeProvider } from 'styled-components';
import { App } from './app/App';
import { DefaultTheme } from './theme';

// eslint-disable-next-line no-undef
ReactDOM.render(
  <ThemeProvider theme={DefaultTheme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root'),
);

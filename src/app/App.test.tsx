import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { App } from './App';

jest.mock('../firebase/firebase', () => ({
  init: jest.fn(),
}));

describe('App', () => {
  afterEach(cleanup);

  it('renders without crashing', () => {
    // given / when / then
    render(<App />);
  });
});

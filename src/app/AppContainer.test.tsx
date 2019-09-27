import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { AppContainer } from './AppContainer';
import firebase from '../firebase/firebase';

jest.mock('../firebase/firebase', () => ({
  init: jest.fn(),
  login: () => Promise.resolve('uid'),
  loadGrid: jest.fn(),
}));

describe('AppContainer', () => {
  afterEach(cleanup);

  it('renders without crashing', () => {
    // given / when / then
    render(<AppContainer />);
  });

  it('logs-in and loads grid', () => {
    // given
    const loginSpy = jest.spyOn(firebase, 'login');
    const loadGridSpy = jest.spyOn(firebase, 'loadGrid');

    // when
    render(<AppContainer />);

    // then
    expect(loginSpy).toHaveBeenCalled();
    expect(loadGridSpy).toHaveBeenCalledWith('', 'uid');
  });
});

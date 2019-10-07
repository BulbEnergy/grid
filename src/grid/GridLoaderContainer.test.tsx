import React from 'react';
import { render, act } from '@testing-library/react';
import { Router, MemoryRouter } from 'react-router-dom';

import { createMemoryHistory } from 'history';
import { GridLoaderContainer } from './GridLoaderContainer';
import firebase from '../firebase/firebase';
import { Role } from './GridContainer';

jest.mock('../firebase/firebase', () => ({
  login: () => Promise.resolve('uid'),
  loadGrid: jest.fn(),
  createBoard: jest.fn(),
  connectivity: jest.fn(() => ({
    on: () => jest.fn(),
    off: () => jest.fn(),
  })),
  votesDb: jest.fn(() => ({
    on: () => jest.fn(),
    off: () => jest.fn(),
  })),
  votingDb: jest.fn(() => ({
    on: () => jest.fn(),
    off: () => jest.fn(),
  })),
}));

describe('GridLoaderContainer', () => {
  const testHistory = createMemoryHistory();

  afterEach(() => {
    jest.clearAllMocks();
    testHistory.location.state = undefined;
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(<GridLoaderContainer />, { wrapper: MemoryRouter });
    });
  });

  it('loads grid if it exists', async () => {
    // given
    const loginSpy = jest.spyOn(firebase, 'login');
    const loadGridSpy = jest.spyOn(firebase, 'loadGrid');

    loadGridSpy.mockReturnValue(
      Promise.resolve({
        id: 'test',
        rows: 2,
        cols: 2,
        votes: {},
        content: [],
        voteInProgress: false,
        userId: 'me',
        userRole: 'user' as Role,
      }),
    );

    // when
    await act(async () => {
      render(
        <Router history={testHistory}>
          <GridLoaderContainer />
        </Router>,
      );
    });

    // then
    expect(loginSpy).toBeCalled();
    expect(loadGridSpy).toBeCalled();
  });

  it('doesnt attempt to load grid from firebase if GridContainerProps provided', async () => {
    // given
    const loginSpy = jest.spyOn(firebase, 'login');
    const loadGridSpy = jest.spyOn(firebase, 'loadGrid');
    testHistory.location.state = {
      id: 'test',
      rows: 2,
      cols: 2,
      votes: {},
      content: [],
      voteInProgress: false,
      userId: 'me',
      userRole: 'user' as Role,
    };

    // when
    await act(async () => {
      render(
        <Router history={testHistory}>
          <GridLoaderContainer />
        </Router>,
      );
    });

    // then
    expect(loginSpy).not.toBeCalled();
    expect(loadGridSpy).not.toBeCalled();
  });
});

import React from 'react';
import { render, act } from '@testing-library/react';
import { match } from 'react-router-dom';

import { createMemoryHistory } from 'history';
import { GridLoaderContainer, NewGridProps } from './GridLoaderContainer';
import firebase from '../firebase/firebase';
import { Role } from './GridContainer';

jest.mock('../firebase/firebase', () => ({
  login: () => Promise.resolve('uid'),
  loadGrid: jest.fn(),
  createBoard: jest.fn(),
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
  const testMatch: match<string> = {
    params: '',
    isExact: false,
    path: '',
    url: '',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <GridLoaderContainer
          history={testHistory}
          location={testHistory.location}
          match={testMatch}
        />,
      );
    });
  });

  it('loads grid if it exists', async () => {
    // given
    const loginSpy = jest.spyOn(firebase, 'login');
    const loadGridSpy = jest.spyOn(firebase, 'loadGrid');
    const createGridSpy = jest.spyOn(firebase, 'createBoard');

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
        <GridLoaderContainer
          history={testHistory}
          location={testHistory.location}
          match={testMatch}
        />,
      );
    });

    // then
    expect(loginSpy).toBeCalled();
    expect(loadGridSpy).toBeCalled();
    expect(createGridSpy).not.toBeCalled();
  });

  it('creates grid if it doesnt already exist', async () => {
    // given
    const loginSpy = jest.spyOn(firebase, 'login');
    const loadGridSpy = jest.spyOn(firebase, 'loadGrid');
    const createGridSpy = jest.spyOn(firebase, 'createBoard');
    const newGrid: NewGridProps = {
      rows: 3,
      cols: 3,
      content: [''],
    };

    loadGridSpy.mockReturnValue(Promise.resolve(undefined));

    // when
    await act(async () => {
      render(
        <GridLoaderContainer
          history={testHistory}
          location={{
            state: newGrid,
            pathname: '',
            search: '',
            hash: '',
          }}
          match={testMatch}
        />,
      );
    });

    // then
    expect(loginSpy).toBeCalled();
    expect(loadGridSpy).toBeCalled();
    expect(createGridSpy).toBeCalled();
  });

  it('doesnt attempt to create grid if no NewGridProps provided', async () => {
    // given
    const loginSpy = jest.spyOn(firebase, 'login');
    const loadGridSpy = jest.spyOn(firebase, 'loadGrid');
    const createGridSpy = jest.spyOn(firebase, 'createBoard');

    loadGridSpy.mockReturnValue(Promise.resolve(undefined));

    // when
    await act(async () => {
      render(
        <GridLoaderContainer
          history={testHistory}
          location={{
            state: undefined,
            pathname: '',
            search: '',
            hash: '',
          }}
          match={testMatch}
        />,
      );
    });

    // then
    expect(loginSpy).toBeCalled();
    expect(loadGridSpy).toBeCalled();
    expect(createGridSpy).not.toBeCalled();
  });
});

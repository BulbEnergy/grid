import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  RenderResult,
  wait,
  act,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, MemoryRouter } from 'react-router-dom';
import { CreateContainer } from './CreateContainer';
import firebase from '../firebase/firebase';
import { Role, GridContainerProps } from '../grid/GridContainer';

jest.mock('nanoid', () => {
  return () => 'gridId';
});

jest.mock('../firebase/firebase', () => ({
  login: () => 'uid',
  createBoard: () => jest.fn(),
}));

describe('CreateContainer', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    // given / when / then
    render(<CreateContainer />, { wrapper: MemoryRouter });
  });

  it('createNewGrid creates grid and pushes grid props to history', async () => {
    // given
    const testHistory = createMemoryHistory();
    const loginSpy = jest.spyOn(firebase, 'login');
    const historyPushSpy = jest.spyOn(testHistory, 'push');
    const createGridSpy = jest.spyOn(firebase, 'createBoard');
    const testGrid: GridContainerProps = {
      id: 'test',
      rows: 2,
      cols: 2,
      votes: {},
      content: [],
      voteInProgress: false,
      userId: 'me',
      userRole: 'user' as Role,
    };
    createGridSpy.mockReturnValue(Promise.resolve(testGrid));

    const res: RenderResult = await render(
      <Router history={testHistory}>
        <CreateContainer />
      </Router>,
    );

    // when
    await fireEvent.click(res.getByTitle('Create 2 x 2 grid'));

    // then
    expect(loginSpy).toBeCalled();
    expect(createGridSpy).toBeCalledWith('gridId', 'uid', 2, 2, [
      'A',
      'B',
      'C',
      'D',
    ]);

    await wait(() =>
      expect(historyPushSpy).toHaveBeenCalledWith({
        pathname: '/gridId',
        state: testGrid,
      }),
    );
  });

  it('displays an error if creating a new grid fails', async () => {
    // given
    const testHistory = createMemoryHistory();
    const createGridSpy = jest.spyOn(firebase, 'createBoard');
    createGridSpy.mockReturnValue(Promise.resolve(undefined));

    const res: RenderResult = await render(
      <Router history={testHistory}>
        <CreateContainer />
      </Router>,
    );

    // when
    await act(async () => {
      await fireEvent.click(res.getByTitle('Create 2 x 2 grid'));
    });

    // then
    expect(
      res.getByText('Could not create grid, please try again'),
    ).not.toBeNull();
  });
});

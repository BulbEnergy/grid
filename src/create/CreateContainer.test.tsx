import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  RenderResult,
} from '@testing-library/react';
import { CreateContainer } from './CreateContainer';
import firebase from '../firebase/firebase';

jest.mock('../firebase/firebase', () => ({
  getUserId: jest.fn(),
  createBoard: (link: string, rows: number, cols: number) => Promise.resolve(), // eslint-disable-line @typescript-eslint/no-unused-vars
}));

describe('CreateContainer', () => {
  beforeEach(() => {
    jest.spyOn(window.location, 'assign').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();

    cleanup();
  });

  it('renders without crashing', () => {
    // given / when / then
    render(<CreateContainer />);
  });

  it('createNewGrid delegates to firebase', () => {
    // given
    const res: RenderResult = render(<CreateContainer />);
    const getUserIdSpy = jest.spyOn(firebase, 'getUserId');
    const createBoardSpy = jest.spyOn(firebase, 'createBoard');
    getUserIdSpy.mockReturnValue('me');

    // when
    fireEvent.click(res.getByTitle('Create 2 x 2 grid'));

    // then
    expect(getUserIdSpy).toHaveBeenCalled();
    expect(createBoardSpy).toHaveBeenCalled();
  });
});

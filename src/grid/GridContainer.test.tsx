import React from 'react';
import {
  act,
  render,
  RenderResult,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { GridContainer, GridContainerProps, Vote } from './GridContainer';
import firebase from '../firebase/firebase';

// TODO: find a better way to mock firebase
const mockVotesDbOn = jest.fn();
const mockVotesDbChildSet = jest.fn();
const mockVotesDbChild = jest.fn(() => ({
  set: mockVotesDbChildSet,
}));

jest.mock('../firebase/firebase', () => ({
  votesDb: jest.fn(() => ({
    on: mockVotesDbOn,
    off: jest.fn(),
    child: mockVotesDbChild,
    set: jest.fn(),
  })),
  votingDb: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    child: jest.fn(),
    set: jest.fn(),
  })),
  login: () => Promise.resolve('uid'),
  connectivity: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
  })),
}));

const defaultProps: GridContainerProps = {
  id: 'aGridId',
  rows: 1,
  cols: 1,
  votes: {},
  content: [],
  voteInProgress: false,
  userId: 'aUserId',
  userRole: 'admin',
};

function getGridElement(res: RenderResult): Element {
  const grid: Element | null = res.container.querySelector('#Grid');

  if (grid === null) {
    throw Error('Could not find grid element');
  }

  return grid;
}

function createVote(emoji: string): Vote {
  return { x: 0, y: 0, emoji };
}

describe('GridContainer', () => {
  afterEach(() => {
    mockVotesDbOn.mockClear();
    mockVotesDbChild.mockClear();
    mockVotesDbChildSet.mockClear();
    cleanup();
  });

  it('renders without crashing', () => {
    render(<GridContainer {...defaultProps} />);
  });

  it('allows votes when voting in progress', () => {
    // given
    const voteInProgress = true;
    const props: GridContainerProps = { ...defaultProps, voteInProgress };
    const res: RenderResult = render(<GridContainer {...props} />);
    const grid: Element = getGridElement(res);

    // when
    fireEvent.click(grid);

    // then
    expect(firebase.votesDb).toHaveBeenCalledWith('aGridId');
    expect(mockVotesDbChild).toBeCalledWith('aUserId');
    expect(mockVotesDbChildSet).toBeCalled();
  });

  it('doesnt allow voting when voting not in progess', () => {
    // given
    const voteInProgress = false;
    const props: GridContainerProps = { ...defaultProps, voteInProgress };
    const res: RenderResult = render(<GridContainer {...props} />);
    const grid: Element = getGridElement(res);

    // when
    fireEvent.click(grid);

    // then
    expect(firebase.votesDb).toHaveBeenCalledWith('aGridId');
    expect(mockVotesDbChild).not.toBeCalled();
    expect(mockVotesDbChildSet).not.toBeCalled();
  });

  it('allows voting when already voted, if the vote is still in progress', () => {
    // given
    const votes = { aUserId: { emoji: '🐰', x: 0.5, y: 0.5 } };
    const voteInProgress = true;
    const props: GridContainerProps = {
      ...defaultProps,
      voteInProgress,
      votes,
    };
    const res: RenderResult = render(<GridContainer {...props} />);
    const grid: Element = getGridElement(res);

    // when
    fireEvent.click(grid);

    // then
    expect(firebase.votesDb).toHaveBeenCalledWith('aGridId');
    expect(mockVotesDbChild).toBeCalled();
    expect(mockVotesDbChildSet).toBeCalled();
  });

  it('updates votes when voting not in progress', async () => {
    // given
    const voteInProgress = false;
    const props: GridContainerProps = { ...defaultProps, voteInProgress };
    const res: RenderResult = render(<GridContainer {...props} />);

    expect(mockVotesDbOn).toHaveBeenCalled();
    const updateVotes = mockVotesDbOn.mock.calls[0][1];
    const votes: Vote[] = [createVote('🐴'), createVote('🦒')];

    // when
    act(() => updateVotes({ exists: () => true, val: () => votes }));

    // then
    expect(res.queryByText('🐴')).toBeTruthy();
    expect(res.queryByText('🦒')).toBeTruthy();
  });

  it('doesnt update votes when voting in progress', () => {
    // given
    const voteInProgress = true;
    const props: GridContainerProps = { ...defaultProps, voteInProgress };
    const res: RenderResult = render(<GridContainer {...props} />);

    expect(mockVotesDbOn).toHaveBeenCalled();
    const updateVotes = mockVotesDbOn.mock.calls[0][1];
    const votes: Vote[] = [createVote('🐴'), createVote('🦒')];

    // when
    act(() => updateVotes({ exists: () => true, val: () => votes }));

    // then
    expect(res.queryByText('🐴')).toBeFalsy();
    expect(res.queryByText('🦒')).toBeFalsy();
  });

  it('updates voting when firebase updates', () => {});

  it('doesnt update voting when nothing changed', () => {});

  it('resets when admin button pressed', () => {});
});

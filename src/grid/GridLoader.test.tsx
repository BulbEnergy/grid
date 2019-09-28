import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { GridLoader } from './GridLoader';
import { GridContainerProps } from './GridContainer';

jest.mock('../firebase/firebase', () => ({
  getUserId: jest.fn(),
  init: jest.fn(),
  votesDb: jest.fn(() => ({
    on: () => jest.fn(),
    off: () => jest.fn(),
  })),
  votingDb: jest.fn(() => ({
    on: () => jest.fn(),
    off: () => jest.fn(),
  })),
}));

describe('GridLoader', () => {
  it('renders without crashing', () => {
    render(<GridLoader loading />);
  });

  it('renders Loading... when loading', () => {
    // given / when
    const res: RenderResult = render(<GridLoader loading />);

    // then
    expect(res.container.querySelector('#Loader')).not.toBeNull();
  });

  it('renders 404 if grid not found', () => {
    // given / when
    const res: RenderResult = render(
      <GridLoader loading={false} grid={undefined} />,
    );

    // then
    expect(res.getByText("We can't load that grid 💔")).toBeTruthy();
  });

  it('renders GridContainer if gridId and grid provided', () => {
    // given
    const grid: GridContainerProps = {
      id: 'test',
      rows: 2,
      cols: 2,
      votes: {},
      content: [],
      voteInProgress: false,
      userId: 'me',
      userRole: 'user',
    };

    // when
    const res: RenderResult = render(
      <GridLoader loading={false} grid={grid} />,
    );

    // then
    expect(res.container.querySelector('#Grid')).not.toBeNull();
  });
});

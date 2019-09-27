import React from 'react';
import { cleanup, render, RenderResult } from '@testing-library/react';
import { App } from './App';
import { GridContainerProps } from '../grid/GridContainer';

jest.mock('../firebase/firebase', () => ({
  getUserId: jest.fn(),
  votesDb: jest.fn(() => ({
    on: () => jest.fn(),
    off: () => jest.fn(),
  })),
  votingDb: jest.fn(() => ({
    on: () => jest.fn(),
    off: () => jest.fn(),
  })),
}));

describe('App', () => {
  afterEach(cleanup);

  it('renders without crashing', () => {
    // given / when / then
    render(<App loading={false} gridId="test" />);
  });

  it('renders Loading... when loading', () => {
    // given / when
    const res: RenderResult = render(<App loading gridId="test" />);

    // then
    expect(res.container.querySelector('#Loader')).not.toBeNull();
  });

  it('renders 404 if grid not found', () => {
    // given / when
    const res: RenderResult = render(<App loading={false} gridId="test" />);

    // then
    expect(() => res.getByText("We can't find that grid")).not.toThrow();
  });

  it('renders CreateContainer if no gridId provided', () => {
    // given / when
    const res: RenderResult = render(<App loading={false} gridId="" />);

    // then
    expect(() => res.getByTitle('Create 2 x 2 grid')).not.toThrow();
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
      <App loading={false} gridId="test" grid={grid} />,
    );

    // then
    expect(res.container.querySelector('#Grid')).not.toBeNull();
  });
});

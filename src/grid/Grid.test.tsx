import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { Grid, GridProps, VoteCoords } from './Grid';
import { Vote } from './GridContainer';

const defaultProps: GridProps = {
  id: '',
  rows: 1,
  cols: 1,
  votes: [],
  content: [],
  voteInProgress: false,
  myVote: undefined,
  isAdmin: false,
  connected: true,
  onAdminButtonClicked: () => {},
  onClick: (event: VoteCoords) => {}, // eslint-disable-line @typescript-eslint/no-unused-vars
};

function mockBoundingClientRect(
  width: number,
  height: number,
  x: number,
  y: number,
) {
  // eslint-disable-next-line no-undef
  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    width,
    height,
    x,
    y,
    bottom: 0,
    left: x,
    top: y,
    right: 0,
  }));
}

describe('Grid', () => {
  it('renders without crashing', () => {
    render(<Grid {...defaultProps} />);
  });

  it('renders correct number of rows and columns', () => {
    // given
    const rows = 4;
    const cols = 3;
    const props: GridProps = { ...defaultProps, rows, cols };

    // when
    const res: RenderResult = render(<Grid {...props} />);

    // then
    expect(res.container.querySelectorAll('#row-divider').length).toEqual(3);
    expect(res.container.querySelectorAll('#col-divider').length).toEqual(2);
  });

  it('renders CountDown when voting in progress', () => {
    // given
    const voteInProgress = true;
    const props: GridProps = { ...defaultProps, voteInProgress };

    // when
    const res: RenderResult = render(<Grid {...props} />);

    // then
    expect(res.container.querySelector('#countdown')).not.toBeNull();
  });

  it('does not render CountDown when voting not in progress', () => {
    // given
    const voteInProgress = false;
    const props: GridProps = { ...defaultProps, voteInProgress };

    // when
    const res: RenderResult = render(<Grid {...props} />);

    // then
    expect(res.container.querySelector('#countdown')).toBeNull();
  });

  it('shows admin button to admins', () => {
    // given
    const isAdmin = true;
    const props: GridProps = { ...defaultProps, isAdmin };

    // when
    const res: RenderResult = render(<Grid {...props} />);

    // then
    expect(res.container.querySelector('#admin-button')).not.toBeNull();
  });

  it('does not show admin button to users', () => {
    // given
    const isAdmin = false;
    const props: GridProps = { ...defaultProps, isAdmin };

    // when
    const res: RenderResult = render(<Grid {...props} />);

    // then
    expect(res.container.querySelector('#admin-button')).toBeNull();
  });

  it('renders votes in correct position', () => {
    // given
    const votes: Vote[] = [{ x: 0.25, y: 0.75, emoji: '🦊' }];
    const props: GridProps = { ...defaultProps, votes };
    mockBoundingClientRect(100, 100, 0, 0);

    // when
    const res: RenderResult = render(<Grid {...props} />);

    // then
    const vote: Element | null = res.container.querySelector('#vote');

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    expect(vote).not.toBeNull();
    expect(vote!.textContent).toEqual('🦊');
    expect(vote!.getAttribute('x')).toEqual('25');
    expect(vote!.getAttribute('y')).toEqual('75');
    /* eslint-enable */
  });

  it('renders vote in correct position when grid is not full width', () => {
    // given
    const votes: Vote[] = [{ x: 0.25, y: 0.75, emoji: '🦊' }];
    const props: GridProps = { ...defaultProps, votes };
    mockBoundingClientRect(100, 100, 100, 100);

    // when
    const res: RenderResult = render(<Grid {...props} />);

    // then
    const vote: Element | null = res.container.querySelector('#vote');

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    expect(vote).not.toBeNull();
    expect(vote!.textContent).toEqual('🦊');
    expect(vote!.getAttribute('x')).toEqual('125');
    expect(vote!.getAttribute('y')).toEqual('175');
    /* eslint-enable */
  });

  it('scales vote on click', () => {});

  it('displays a connectivity lost warning when disconnected', () => {
    // given
    const connected = false;
    const props: GridProps = { ...defaultProps, connected };

    // when
    const { getByTestId }: RenderResult = render(<Grid {...props} />);

    // then
    expect(getByTestId('connection-lost')).not.toBeNull();
  });
});

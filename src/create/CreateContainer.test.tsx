import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  RenderResult,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { match } from 'react-router-dom';
import { CreateContainer } from './CreateContainer';

describe('CreateContainer', () => {
  const testHistory = createMemoryHistory();
  const testMatch: match<string> = {
    params: '',
    isExact: false,
    path: '',
    url: '',
  };

  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    // given / when / then
    render(
      <CreateContainer
        history={testHistory}
        location={testHistory.location}
        match={testMatch}
      />,
    );
  });

  it('createNewGrid pushes grid props to history', () => {
    // given
    testHistory.location.state = {};
    const res: RenderResult = render(
      <CreateContainer
        history={testHistory}
        location={testHistory.location}
        match={testMatch}
      />,
    );

    // when
    fireEvent.click(res.getByTitle('Create 2 x 2 grid'));

    // then
    expect(testHistory.location.state).toEqual({
      cols: 2,
      rows: 2,
      content: ['A', 'B', 'C', 'D'],
    });
  });
});

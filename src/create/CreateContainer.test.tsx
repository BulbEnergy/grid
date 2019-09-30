import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  RenderResult,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { CreateContainer } from './CreateContainer';

describe('CreateContainer', () => {
  const testHistory = createMemoryHistory();

  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    // given / when / then
    render(
      <Router history={testHistory}>
        <CreateContainer />
      </Router>,
    );
  });

  it('createNewGrid pushes grid props to history', () => {
    // given
    testHistory.location.state = {};
    const res: RenderResult = render(
      <Router history={testHistory}>
        <CreateContainer />
      </Router>,
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

import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  RenderResult,
} from '@testing-library/react';
import { Create } from './Create';

describe('Create', () => {
  afterEach(cleanup);

  it('renders without crashing', () => {
    // given / when / then
    render(
      <Create onCreateHandler={() => {}} error={false} creating={false} />,
    );
  });

  it('renders Loading... when creating', () => {
    // given / when
    const res: RenderResult = render(
      <Create onCreateHandler={() => {}} error={false} creating />,
    );

    // then
    expect(res.container.querySelector('#Loader')).not.toBeNull();
  });

  it('renders error message when there is an error', () => {
    // given / when
    const res: RenderResult = render(
      <Create onCreateHandler={() => {}} error creating={false} />,
    );

    // then
    expect(
      res.getByText('Could not create grid, please try again'),
    ).not.toBeNull();
  });

  it('handler is called on click when 2x2 grid created', () => {
    // given
    const handler = jest.fn();
    const res: RenderResult = render(
      <Create onCreateHandler={handler} error={false} creating={false} />,
    );

    // when
    fireEvent.click(res.getByTitle('Create 2 x 2 grid'));

    // then
    expect(handler).toHaveBeenCalledWith('2x2');
  });

  it('handler is called on click when 3x3 grid created', () => {
    // given
    const handler = jest.fn();
    const res: RenderResult = render(
      <Create onCreateHandler={handler} error={false} creating={false} />,
    );

    // when
    fireEvent.click(res.getByTitle('Create 3 x 3 grid'));

    // then
    expect(handler).toHaveBeenCalledWith('3x3');
  });
});

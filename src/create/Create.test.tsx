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
    render(<Create onCreateHandler={() => {}} />);
  });

  it('handler is called on click when 2x2 grid created', () => {
    // given
    const handler = jest.fn();
    const res: RenderResult = render(<Create onCreateHandler={handler} />);

    // when
    fireEvent.click(res.getByTitle('Create 2 x 2 grid'));

    // then
    expect(handler).toHaveBeenCalledWith('2x2');
  });

  it('handler is called on click when 3x3 grid created', () => {
    // given
    const handler = jest.fn();
    const res: RenderResult = render(<Create onCreateHandler={handler} />);

    // when
    fireEvent.click(res.getByTitle('Create 3 x 3 grid'));

    // then
    expect(handler).toHaveBeenCalledWith('3x3');
  });
});

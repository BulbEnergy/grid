import React from 'react';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import { AdminButton } from './AdminButton';

describe('AdminButton', () => {
  it('renders without crashing', () => {
    render(<AdminButton onClickHandler={() => null} />);
  });

  it('triggers callback on click', () => {
    // given
    const handler = jest.fn();
    const res: RenderResult = render(<AdminButton onClickHandler={handler} />);
    const element: Element | null = res.container.querySelector(
      '#admin-button',
    );
    expect(element).not.toBeNull();

    // when
    fireEvent.click(element as Element);

    // then
    expect(handler).toHaveBeenCalled();
  });
});

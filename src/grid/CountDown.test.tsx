import React from 'react';
import { render } from '@testing-library/react';
import { CountDown } from './CountDown';

describe('CountDown', () => {
  it('renders without crashing', () => {
    render(<CountDown duration={0} />);
  });
});

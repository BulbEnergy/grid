import React from 'react';
import { render } from '@testing-library/react';
import { AnimatedVote } from './AnimatedVote';

it('renders without crashing', () => {
  render(<AnimatedVote x={0} y={0} emoji="" delay={1} />);
});

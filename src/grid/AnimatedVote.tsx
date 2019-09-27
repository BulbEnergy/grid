import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface VoteProps {
  x: number;
  y: number;
  emoji: string;
  delay: number;
}

const enterAnimation = keyframes`
  0% {
    visibility: visible;
    transform: translate(-50%, -50%) scale(0);
  }

  99% {
    visibility: visible;
    transform: translate(-50%, -50%) scale(1.2);
  }

  100% {
    visibility: visible;
    animation-timing-function: ease-inout;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const EmojiWrapper = styled.div`
  visibility: hidden;
  position: absolute;
  left: ${(props: VoteProps) => props.x}px;
  top: ${(props: VoteProps) => props.y}px;
  transform: translate(-50%, -50%);
  animation: ${enterAnimation} 0.25s;
  animation-delay: ${(props: VoteProps) => props.delay}s;
  animation-fill-mode: forwards;
  font-size: 50px;
`;

const AnimatedVote = (props: VoteProps) => {
  const { emoji } = props;
  return (
    <EmojiWrapper id="vote" {...props}>
      {emoji}
    </EmojiWrapper>
  );
};

export { AnimatedVote };

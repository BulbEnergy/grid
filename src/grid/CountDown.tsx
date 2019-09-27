import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Theme } from '../theme';

interface CountDownProps {
  duration: number;
}

const expandRightThenHide = keyframes`
  0% {
    transform: scaleX(0);
  }

  90% {
    transform: scaleX(1);
  }

  95% {
    transform: scaleX(1);
  }

  100% {
    transform: scaleY(0);
  }
`;

const CountDownRect = styled.div`
  background-color: ${(p: CountDownRectProps) => p.theme.primaryColor};
  transform-origin: 0% 0%;
  animation: ${expandRightThenHide} ${(p: CountDownRectProps) => p.duration}s
    linear forwards;
  height: 15px;
  width: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
`;

interface CountDownRectProps {
  duration: number;
  theme: Theme;
}

interface CountDownProps {
  duration: number;
}

const CountDown = (props: CountDownProps) => {
  const { duration } = props;

  return <CountDownRect id="countdown" duration={duration} />;
};

export { CountDown };

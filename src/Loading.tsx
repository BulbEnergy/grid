import React from 'react';
import styled, { keyframes, Keyframes } from 'styled-components';
import { Theme } from './theme';

const loaderSize = 150;

const growHorizontal = keyframes`
  0% {
    visibility: visible;
    transform: scaleX(0);
  }

  100% {
    visibility: visible;
    animation-timing-function: ease-inout;
    transform: scaleX(1);
  }
`;

const growVertical = keyframes`
  0% {
    visibility: visible;
    transform: scaleY(0);
  }

  100% {
    visibility: visible;
    animation-timing-function: ease-inout;
    transform: scaleY(1);
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: center;
`;
const LoaderSvg = styled.svg`
  align-self: center;
  width: ${loaderSize}px;
  height: ${loaderSize}px;
`;

const LoaderLine = styled.line`
  visibility: hidden;
  stroke-width: 7px;
  stroke: ${(props: LoaderLineProps) => props.theme.primaryColor};
  animation: ${(props: LoaderLineProps) => props.animation} 1s infinite;
  animation-delay: ${(props: LoaderLineProps) => props.delay}s;
  animation-direction: alternate;
  transform-origin: ${(props: LoaderLineProps) => props.xTransformOrigin}%
    ${(props: LoaderLineProps) => props.yTransformOrigin}%;
`;

interface LoaderLineProps {
  animation: Keyframes;
  delay: number;
  xTransformOrigin: number;
  yTransformOrigin: number;
  theme: Theme;
}

const Loading = () => (
  <FlexContainer>
    <LoaderSvg id="Loader">
      <LoaderLine
        x1={0.33 * loaderSize}
        y1={0}
        x2={0.33 * loaderSize}
        y2={loaderSize}
        animation={growVertical}
        delay={0}
        xTransformOrigin={0}
        yTransformOrigin={0}
      />
      <LoaderLine
        x1={0.66 * loaderSize}
        y1={0}
        x2={0.66 * loaderSize}
        y2={loaderSize}
        animation={growVertical}
        delay={0.1}
        xTransformOrigin={0}
        yTransformOrigin={100}
      />
      <LoaderLine
        x1={0}
        y1={0.33 * loaderSize}
        x2={loaderSize}
        y2={0.33 * loaderSize}
        animation={growHorizontal}
        delay={0.2}
        xTransformOrigin={0}
        yTransformOrigin={0}
      />
      <LoaderLine
        x1={0}
        y1={0.66 * loaderSize}
        x2={loaderSize}
        y2={0.66 * loaderSize}
        animation={growHorizontal}
        delay={0.3}
        xTransformOrigin={100}
        yTransformOrigin={0}
      />
    </LoaderSvg>
  </FlexContainer>
);

export { Loading };

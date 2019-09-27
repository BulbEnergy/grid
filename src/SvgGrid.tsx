import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg`
  display: block;
  width: ${(props: SvgProps) => props.width}px;
  height: ${(props: SvgProps) => props.height}px;
`;

const GridLine = styled.line`
  stroke: ${(props: GridLineProps) => props.lineColor};
  stroke-width: ${(props: GridLineProps) => props.lineWidth}px;
`;

interface SvgProps {
  width: number;
  height: number;
  title: string;
}

interface GridLineProps {
  lineWidth: number;
  lineColor: string;
}

interface SvgGridProps {
  width: number;
  height: number;
  lineWidth: number;
  lineColor: string;
  rows: number;
  cols: number;
  title: string;
}

const SvgGrid: React.FunctionComponent<SvgGridProps> = (
  props: SvgGridProps,
) => {
  const { width, height, rows, cols, title, lineColor, lineWidth } = props;

  const lines = [];
  for (let r = 0; r < rows - 1; r += 1) {
    lines.push(
      <GridLine
        key={`row-${r}`}
        x1={0}
        y1={((1 + r) / rows) * height}
        x2={width}
        y2={((1 + r) / rows) * height}
        lineColor={lineColor}
        lineWidth={lineWidth}
      />,
    );
  }

  for (let c = 0; c < cols - 1; c += 1) {
    lines.push(
      <GridLine
        key={`col-${c}`}
        x1={((1 + c) / cols) * width}
        y1={0}
        x2={((1 + c) / cols) * width}
        y2={height}
        lineColor={lineColor}
        lineWidth={lineWidth}
      />,
    );
  }

  return (
    <Svg width={width} height={height} title={title}>
      {lines}
    </Svg>
  );
};

export { SvgGrid };

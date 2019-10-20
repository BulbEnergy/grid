import React, { useRef, useEffect, useState, RefObject } from 'react';
import styled from 'styled-components';
import * as _ from 'lodash';
import { CountDown } from './CountDown';
import { Vote } from './GridContainer';
import { AnimatedVote } from './AnimatedVote';
import { AdminButton } from './AdminButton';
import { Theme } from '../theme';
import { ConnectionLost } from '../ConnectionLost';

export interface GridProps {
  id: string;
  rows: number;
  cols: number;
  votes: Vote[];
  myVote: Vote | undefined;
  content: string[];
  voteInProgress: boolean;
  isAdmin: boolean;
  connected: boolean;
  onAdminButtonClicked: () => void;
  onClick: (event: VoteCoords) => void;
}

function createGridCells(rows: number, cols: number, content: string[]) {
  const cells = [];

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      cells.push(
        <GridCell key={`cell-${r}-${c}`} rows={r * 2 + 2} cols={c * 2 + 2}>
          <Content>{content[r * cols + c] || ''}</Content>
        </GridCell>,
      );
    }
  }

  for (let r = 0; r < rows - 1; r += 1) {
    cells.push(
      <GridLine
        key={`line-h${r}`}
        id="row-divider"
        rowStart={r * 2 + 3}
        rowEnd={r * 2 + 3}
        colStart={2}
        colEnd={cols * 2 + 1}
      />,
    );
  }

  for (let c = 0; c < cols - 1; c += 1) {
    cells.push(
      <GridLine
        key={`line-v${c}`}
        id="col-divider"
        rowStart={2}
        rowEnd={rows * 2 + 1}
        colStart={c * 2 + 3}
        colEnd={c * 2 + 3}
      />,
    );
  }

  return cells;
}

const GridTouchArea = styled.div`
  flex: 1;
  position: relative;
`;

const GridFlexContainer = styled.div`
  flex-direction: column;
  align-items: center;
  display: flex;
  height: 100%;
`;

const GridDiv = styled.div`
  display: grid;
  grid-template-rows: 5px repeat(${(props: GridLayout) => props.rows}, 1fr 5px);
  grid-template-columns: 5px repeat(
      ${(props: GridLayout) => props.cols},
      1fr 5px
    );
  gap: 5px;
  flex: 1;
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
  @media (min-width: 1080px) {
    width: 1080px;
  }
  :hover {
    cursor: pointer;
  }
`;

const GridCell = styled.div`
  background-color: ${(p: GridCellProps) => p.theme.secondaryColor};
  border-radius: 20px;
  grid-column-start: ${(p: GridCellProps) => p.cols}
  grid-row-start: ${(p: GridCellProps) => p.rows}
  position: relative;
`;

const Content = styled.p`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24pt;
`;

const GridLine = styled.div`
  grid-column-start: ${(p: GridLineProps) => p.colStart}
  grid-column-end: ${(p: GridLineProps) => p.colEnd}
  grid-row-start: ${(p: GridLineProps) => p.rowStart}
  grid-row-end: ${(p: GridLineProps) => p.rowEnd}
  border-radius: 30px;
  background-color: ${(p: GridLineProps) => p.theme.primaryColor};
`;

interface GridCellProps {
  rows: number;
  cols: number;
  theme: Theme;
}

interface GridLineProps {
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
  theme: Theme;
}

interface GridLayout {
  rows: number;
  cols: number;
}

export interface VoteCoords {
  x: number;
  y: number;
}

interface GridDimensions {
  width: number;
  height: number;
  x: number;
  y: number;
}

function getDimensions(ref: RefObject<HTMLDivElement>): GridDimensions {
  if (ref.current) {
    const rect: ClientRect = ref.current.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
    };
  }
  return {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };
}

const Grid: React.FunctionComponent<GridProps> = (props: GridProps) => {
  const {
    rows,
    connected,
    cols,
    content,
    isAdmin,
    onAdminButtonClicked,
    onClick,
    voteInProgress,
    votes,
    myVote,
  } = props;

  const ref: RefObject<HTMLDivElement> = useRef(null);
  const [dimensions, setDimensions] = useState<GridDimensions>(
    getDimensions(ref),
  );

  const cells = createGridCells(rows, cols, content);

  useEffect(() => {
    const dimens: GridDimensions = getDimensions(ref);
    if (!_.isEqual(dimensions, dimens)) {
      setDimensions(dimens);
    }

    const handleResize = () => {
      setDimensions(getDimensions(ref));
    };

    // eslint-disable-next-line no-undef
    window.addEventListener('resize', handleResize);
    return () => {
      // eslint-disable-next-line no-undef
      window.removeEventListener('resize', handleResize);
    };
  }, [dimensions]);

  function handleTouch(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    const width = dimensions.width || 1;
    const height = dimensions.height || 1;

    onClick({
      x: (event.clientX - dimensions.x) / width,
      y: (event.clientY - dimensions.y) / height,
    });
  }

  return (
    <GridTouchArea>
      {!connected && <ConnectionLost />}
      <GridFlexContainer>
        <GridDiv
          id="Grid"
          onClick={handleTouch}
          ref={ref}
          rows={rows}
          cols={cols}
        >
          {cells}
        </GridDiv>

        {isAdmin && <AdminButton onClickHandler={onAdminButtonClicked} />}
      </GridFlexContainer>

      {voteInProgress && <CountDown duration={5} />}

      {!voteInProgress &&
        votes.map(vote => (
          <AnimatedVote
            key={`vote-${vote.x}${vote.y}${vote.emoji}`}
            x={dimensions.x + vote.x * dimensions.width}
            y={dimensions.y + vote.y * dimensions.height}
            emoji={vote.emoji}
            delay={Math.random() * 0.75}
          />
        ))}

      {myVote && (
        <AnimatedVote
          key={`myVote_${myVote.x}_${myVote.y}`}
          x={dimensions.x + myVote.x * dimensions.width}
          y={dimensions.y + myVote.y * dimensions.height}
          emoji={myVote.emoji}
          delay={0}
        />
      )}
    </GridTouchArea>
  );
};

export { Grid };

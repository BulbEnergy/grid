import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Button } from '../shared/Button';
import { GridLayout } from './CreateContainer';
import { SvgGrid } from '../SvgGrid';
import { Theme, DefaultTheme } from '../theme';

export interface CreateProps {
  onCreateHandler: (layout: GridLayout) => void;
}

const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Row = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: row;
`;

const GridButton = styled(Button)`
  margin: 20px;
`;

const Text = styled.div`
  text-align: center;
  font-size: 22pt;
  color: #003366;
`;

const Create: React.FunctionComponent<CreateProps> = (props: CreateProps) => {
  const theme: Theme = useContext(ThemeContext) || DefaultTheme;
  const { onCreateHandler } = props;

  return (
    <Container>
      <Row>
        <Text>Create a new grid</Text>
      </Row>
      <Row>
        <GridButton onClick={() => onCreateHandler('2x2')}>
          <SvgGrid
            title="Create 2 x 2 grid"
            width={100}
            height={100}
            rows={2}
            cols={2}
            lineWidth={3}
            lineColor={theme.primaryColor}
          />
        </GridButton>

        <GridButton onClick={() => onCreateHandler('3x3')}>
          <SvgGrid
            title="Create 3 x 3 grid"
            width={100}
            height={100}
            rows={3}
            cols={3}
            lineWidth={3}
            lineColor={theme.primaryColor}
          />
        </GridButton>
      </Row>
    </Container>
  );
};

export { Create };

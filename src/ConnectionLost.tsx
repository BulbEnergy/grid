import React from 'react';
import styled from 'styled-components';

import { Loader } from './Loading';

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: center;
  position: fixed;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
`;

const ConnectionLost: React.FC = () => {
  return (
    <Container data-testid="connection-lost">
      <Loader />
    </Container>
  );
};

export { ConnectionLost };

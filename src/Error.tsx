import React from 'react';
import styled from 'styled-components';
import { Centered } from './shared/Centered';

const ErrorMessage = styled.div`
  margin: auto;
  width: 50%;
  font-size: 21pt;
  text-align: center;
  padding: 200px;
`;

export interface ErrorProps {
  message: string;
}

const Error: React.FunctionComponent<ErrorProps> = (props: ErrorProps) => {
  const { message } = props;

  return (
    <Centered>
      <ErrorMessage>{message}</ErrorMessage>
    </Centered>
  );
};

export { Error };

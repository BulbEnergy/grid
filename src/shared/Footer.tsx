import React from 'react';
import styled from 'styled-components';
import { Branding } from '../grid/Branding';
import { config } from '../config';

const FooterDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  padding: 20px;
  box-sizing: border-box;
`;

const FlexItem = styled.div`
  flex-grow: 1;
  flex-basis: 0;
`;

const Footer = () => (
  <FooterDiv>
    {config.branding.enabled && (
      <FlexItem>
        <Branding />
      </FlexItem>
    )}
  </FooterDiv>
);

export { Footer };

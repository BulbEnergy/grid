import React from 'react';
import styled from 'styled-components';
import { config } from '../config';

const BrandingDiv = styled.div`
  display: flex;
  align-items: flex-end;
`;
const Logo = styled.img`
  padding-left: 5px;
  padding-right: 5px;
`;

const Text = styled.span`
  color: #003366;
`;

const Branding: React.FunctionComponent = () => (
  <BrandingDiv>
    <Text>made by</Text>
    <Logo src={config.branding.logoSrc} />
  </BrandingDiv>
);

export { Branding };

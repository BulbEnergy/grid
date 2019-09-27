import styled from 'styled-components';

const Button = styled.div`
  background-color: #ffffff;
  border: ${p => p.theme.primaryColor} solid;
  padding: 12px;
  text-align: center;
  border-radius: 6px;
  :hover {
    background-color: ${p => p.theme.secondaryColor};
    cursor: pointer;
  }
`;

export { Button };

import styled from "styled-components";

const Wrapper = styled.div`
  text-align: center;
`;

const StyledImage = styled.img`
  display: block;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

const Header = () => (
  <Wrapper>
    <StyledImage src="../../icons/128.png" width="96px" />
    <h2>YouTube Downloads</h2>
  </Wrapper>
);

export default Header;
import styled from 'styled-components';

const Wrapper = styled.div`
  & > :first-child {
    border-radius: 10px 10px 0 0;
  }
  & > :last-child {
    border-radius: 0 0 10px 10px;
  }
`;

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const RoundedWrapper = ({ children }: Props) => <Wrapper>{children}</Wrapper>;

export default RoundedWrapper;

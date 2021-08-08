import styled from 'styled-components';

const Wrapper = styled.div`
  & > :first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  & > :last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const RoundedWrapper = ({ children }: Props) => <Wrapper>{children}</Wrapper>;

export default RoundedWrapper;

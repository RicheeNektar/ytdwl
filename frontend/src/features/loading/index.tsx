import styled, { keyframes } from 'styled-components';

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingCircle = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 4rem;
  z-index: 1;

  &:after {
    content: ' ';
    display: block;
    width: 24px;
    height: 24px;
    margin: 1rem 0 0 calc(50% - 24px);
    border-radius: 50%;
    border: 3px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: ${spinAnimation} 1.2s linear infinite;
  }
`;

type Props = {
  children?: any;
  isLoading: boolean;
  className?: string;
};

const defaultProps: Pick<Props, 'isLoading'> = {
  isLoading: false,
};

const Loading = ({ isLoading, children, className }: Props) => (
  <div className={className}>{isLoading ? <LoadingCircle /> : children}</div>
);

Loading.defaultProps = defaultProps;

export default Loading;

import styled from 'styled-components';

type Props = {
  className?: string;
  isAudio: boolean;
  progress: number;
  total: number;
};

const defaultProps: Pick<Props, 'isAudio'> = {
  isAudio: true,
};

const Bar = styled.div<Props>`
  height: 100%;
  display: block;
  position: relative;
  border-radius: 10px;
  margin-bottom: 5px;
  transition: ease-out 0.1s;
  box-shadow: inset 0 0 4px ${p => p.theme.gray100};
  background: ${p => (p.isAudio ? p.theme.audio : p.theme.video)};
  width: ${p => (p.progress / p.total) * 100}%;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 0.5rem;
`;

const ProgressBar = ({ progress, total, isAudio, className }: Props) => {
  const renderBar = () => (
    <Bar progress={progress} total={total} isAudio={isAudio} />
  );

  return <Wrapper className={className}>{renderBar()}</Wrapper>;
};

ProgressBar.defaultProps = defaultProps;
export default ProgressBar;

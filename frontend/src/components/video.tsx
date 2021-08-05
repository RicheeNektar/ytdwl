import { ProgressBar, Thumbnail } from 'components';
import styled from 'styled-components';

const Wrapper = styled.div<{ tabId?: number }>`
  ${p => p.tabId && 'cursor: pointer;'}
  padding: 0.5rem;
  user-select: none;
  background-color: #555;
  box-shadow: 2px 2px 3px #333;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  font-size: 10px;
`;

const VideoInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  margin-left: 0.5rem;
`;

const StyledProgressBar = styled(ProgressBar)`
  margin-top: 0.25rem;
`;

type Props = {
  progressTotal?: number;
  showProgress?: boolean;
  progress?: number;
  isAudio?: boolean;
  tabId?: number;
  video: Video;
};

const defaultProps: Pick<Props, 'isAudio' | 'showProgress'> = {
  showProgress: false,
  isAudio: true,
};

const Video = ({
  progressTotal,
  showProgress,
  progress,
  isAudio,
  tabId,
  video: { title, id },
}: Props) => (
  <Wrapper
    tabId={tabId}
    key={id}
    id={id}
    {...(tabId && { title: 'Switch to tab' })}
  >
    <ContentWrapper>
      <Thumbnail videoId={id} />

      <VideoInfoWrapper>
        <span>{title}</span>
        <span>{isAudio ? 'Audio (.weba)' : 'Video (.webm)'}</span>
      </VideoInfoWrapper>
    </ContentWrapper>

    {showProgress && progressTotal && progress && (
      <StyledProgressBar
        isAudio={isAudio}
        progress={progress}
        total={progressTotal}
      />
    )}
  </Wrapper>
);

Video.defaultProps = defaultProps;
export default Video;

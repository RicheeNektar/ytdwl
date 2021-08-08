import styled from 'styled-components';
import PlaylistFetch from 'features/playlist-fetch';
import DownloadsList from 'features/downloads-list';
import VideoPlayer from 'features/video-player';

const StyledWrapper = styled.div`
  background: #777;
  border-radius: 1rem;
  padding: 0.5rem;
  position: relative;
  min-width: 350px;
  width: 30%;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledDownloadsList = styled(DownloadsList)`
  margin-bottom: 1rem;
`;

const Home = () => (
  <StyledWrapper>
    <VideoPlayer />
    <StyledDownloadsList />
    <br />
    <PlaylistFetch />
  </StyledWrapper>
);

export default Home;

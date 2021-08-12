import React, { createRef } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Loading from 'features/loading';
import { RoundedWrapper, Video } from 'components';
import { AppDispatch, RootState } from 'features/redux/store';
import { fetchVideos as fetchVideosAction } from './redux/slice';
import { videosSelector } from './redux/selectors';

const FormWrapper = styled.form`
  position: relative;
  width: 80%;
  left: 50%;
  transform: translateX(-50%);
`;

const FormField = styled.div`
  display: flex;
  margin: 0.2rem;
  justify-content: space-around;
  align-items: center;
  width: 90%;
`;

const FormColumnField = styled(FormField)`
  flex-direction: column;

  & > * {
    width: 100%;
  }
`;

const StyledLabel = styled.label`
  margin-bottom: 0.2rem;
`;

const mapStateToProps = (state: RootState) => ({
  isFetching: state.playlist.isFetching,
  isAudio: state.playlist.downloadAudio,
  videos: videosSelector(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  fetchVideos: (id: string, downloadAudio: boolean) =>
    dispatch(fetchVideosAction({ id, downloadAudio })),
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const PlaylistFetch = ({ isFetching, fetchVideos, videos, isAudio }: Props) => {
  const playlistUrlRef = createRef<HTMLInputElement>();
  const downloadAudioRef = createRef<HTMLInputElement>();

  const getPlaylistId = (link: string) => {
    try {
      const search = new URL(link).search;

      const listParams = search
        .substring(1)
        .split('&')
        .map(param => param.split('='))
        .find(param => param[0] === 'list');

      return listParams ? listParams[1] : null;
    } catch (e) {
      console.error(e);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const playlistUrl = playlistUrlRef.current;
    const downloadAudio = downloadAudioRef.current;

    if (playlistUrl && downloadAudio) {
      const id = getPlaylistId(playlistUrl.value);

      if (id) {
        fetchVideos(id, downloadAudio.checked);
      }
    }
  };

  const renderVideos = () =>
    !videos || !videos.length ? null : (
      <RoundedWrapper>
        {videos.map(video => (
          <Video isAudio={isAudio} key={video.videoId} video={video} />
        ))}
      </RoundedWrapper>
    );

  return (
    <Loading isLoading={isFetching}>
      <FormWrapper onSubmit={handleFormSubmit}>
        <FormColumnField>
          <StyledLabel htmlFor="playlist-url">
            Playlist URL (Enter to start download)
          </StyledLabel>
          <input
            type="url"
            name="playlist-url"
            id="playlist-input"
            placeholder="https://www.youtube.com/playlist?list=..."
            ref={playlistUrlRef}
          />
        </FormColumnField>
        <FormField>
          <div>
            <input
              type="radio"
              name="mime-type"
              id="audio"
              ref={downloadAudioRef}
              defaultChecked
            />
            <StyledLabel htmlFor="audio">Audio</StyledLabel>
          </div>
          <div>
            <input type="radio" name="mime-type" id="video" />
            <StyledLabel htmlFor="video">Video</StyledLabel>
          </div>
        </FormField>
      </FormWrapper>
      <br />
      {renderVideos()}
    </Loading>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistFetch);

import { AppDispatch, RootState } from 'features/redux/store';
import { connect } from 'react-redux';
import getVideoUrl from 'utils/get-video-url';
import { videoLoaded as videoLoadedAction } from './redux/slice';

const mapStateToProps = (state: RootState) => ({
  videoId: state.videoPlayer.videoId,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  videoLoaded: () => dispatch(videoLoadedAction()),
});

type Props =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>;

const VideoPlayer = ({ videoId, videoLoaded }: Props) => (
  <iframe
    src={videoId && getVideoUrl(videoId, true)}
    title={videoId}
    onLoad={videoLoaded}
  ></iframe>
);

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);

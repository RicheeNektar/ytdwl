import { useEffect } from 'react';
import { connect } from 'react-redux';
import { RoundedWrapper, Video } from 'components';
import { AppDispatch, RootState } from 'features/redux/store';
import {
  fetchDownloads as fetchDownloadsAction,
  removeFirstDownload as removeFirstDownloadAction,
} from './redux/slice';

const mapStateToProps = (state: RootState) => ({
  downloads: state.downloads.downloads,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  fetchDownloads: () => dispatch(fetchDownloadsAction()),
  removeFirstDownload: () => dispatch(removeFirstDownloadAction()),
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const DownloadsList = ({ downloads, fetchDownloads }: Props) => {
  useEffect(() => {
    const interval = setInterval(fetchDownloads, 1000);
    return () => clearInterval(interval);
  });

  if (!downloads) {
    return null;
  }

  return (
    <RoundedWrapper>
      {downloads.map(download => (
        <Video
          key={download.tabId}
          tabId={download.tabId}
          video={{ id: download.videoId, title: download.title }}
          progress={download.received}
          progressTotal={download.total}
          isAudio={download.isAudio}
          showProgress
        />
      ))}
    </RoundedWrapper>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsList);

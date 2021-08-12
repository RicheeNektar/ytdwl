type Props = {
  tabId: number;
  videoId?: string;
  isAudio?: boolean;
  isCancelRequest?: boolean;
};

const startDownload = async ({
  tabId,
  videoId,
  isAudio,
  isCancelRequest,
}: Props) => {
  if (isCancelRequest) {
    storage.cancelDownload(tabId);

  } else if (videoId) {
    const download = storage.getOrCreateDownload({ tabId, videoId, isAudio });

    const streams = storage.getStreams(videoId);
    const title = storage.getTitle(videoId);

    if (streams && streams.audio && streams.video) {
      const isActive = download.status === 'active';

      if (isActive) {
        browser.tabs.executeScript(tabId, {
          code: 'alert("A download is running already in this tab.")',
        });

        throw new Error('download_active');
      } else {
        if (!!title) {
          download.worker.postMessage({
            type: 'init',
            videoId,
            tabId,
            streams,
            isAudio,
          });

          return true;
        } else {
          throw new Error('no_video_title');
        }
      }
    } else {
      throw new Error('no_video_info');
    }
  } else {
    throw new Error('unknown');
  }
};

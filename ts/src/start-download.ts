type Props = {
  tabId: number;
  videoId?: string;
  isAudio?: boolean;
  isCancelRequest?: boolean;
};

const startDownload = ({
  tabId,
  videoId,
  isAudio,
  isCancelRequest,
}: Props) => new Promise((resolve, reject) => {
  if (isCancelRequest) {
    storage.cancelDownload(tabId);

  } else if (videoId) {
    const download = storage.getOrCreateDownload({ tabId, videoId, isAudio: isAudio ?? false });

    const streams = storage.getStreams(videoId);
    const title = storage.getTitle(videoId);

    if (streams && streams.audio && streams.video) {
      const isActive = download.status === 'active';

      if (isActive) {
        browser.tabs.executeScript(tabId, {
          code: 'alert("A download is running already in this tab.")',
        });

        reject('download_active');
      } else {
        if (title) {
          storage.updateDownload(tabId, { status: 'active' })

          download.worker.postMessage({
            type: 'init',
            videoId,
            tabId,
            streams,
            isAudio,
          });

          resolve(null);
        } else {
          reject('no_video_title');
        }
      }
    } else {
      reject('no_video_info');
    }
  } else {
    reject('no_video_id');
  }
});

const workerCommunication = event => {
  let data = event.data;
  let worker = tabsDownloading[data.tabId];

  switch (data.status) {
    case 'init':
      let total = data.total;
      worker.total = total;
      worker.active = true;
      break;
      
    case 'downloading':
      let received = data.received;

      browser.tabs.sendMessage(data.tabId, {
        type: 'update_yt_progress',
        isAudio: data.isAudio,
        bytesTotal: worker.total,
        bytesReceived: received,
      });

      worker.received = received;
      break;

    case 'complete':
      let videoTitle = titles[data.videoId];

      browser.tabs.sendMessage(data.tabId, {
        type: 'clear_yt_progress',
      });

      browser.downloads.download(
        {
          url: data.blob,
          filename: `${videoTitle.substr(0, 128).replace(/[^a-z0-9 \-!?]/gi, '-')}.x`,
        },
        downloadId => {
          worker.downloadId = downloadId;
        }
      );

      if (worker.callback) {
        worker.callback();
      }
      worker.active = false;
      worker.received = 0;
      break;

    case 'stream_link_changed':
      videos[data.videoId][data.isAudio ? 'audio' : 'video'] = data.new_sream_link;
      break;

    default:
      console.warn(`Unhandled worker request: ${data.type}`);
  }
};

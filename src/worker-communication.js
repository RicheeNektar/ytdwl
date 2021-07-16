const workerCommunication = event => {
  let data = event.data;
  let worker = tabsDownloading[data.tabId];

  if (data.status === 'init') {
    let total = data.total;
    worker.total = total;
    worker.active = true;

  } else if (data.status === 'downloading') {
    let received = data.received;

    browser.tabs.sendMessage(data.tabId, {
      type: 'update_yt_progress',
      isAudio: data.isAudio,
      bytesTotal: worker.total,
      bytesReceived: received,
    });

    worker.received = received;

  } else if (data.status === 'complete') {
    let videoTitle = titles[data.videoId];

    browser.tabs.sendMessage(data.tabId, {
      type: 'clear_yt_progress',
    });

    browser.downloads.download(
      {
        url: data.blob,
        filename: `${videoTitle.replace(/[^a-zA-Z0-9 \-.!?]/g, '-')}.x`,
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

  } else if (data.status === 'stream_link_changed') {
    videos[data.videoId][data.isAudio ? 'audio' : 'video'] = data.new_sream_link;
  }
};

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
      type: 'dwlupdate',
      isAudio: data.isAudio,
      bytesTotal: worker.total,
      bytesReceived: received,
    });

    worker.received = received;
  } else if (data.status === 'complete') {
    let videoTitle = titles[data.videoId];

    browser.tabs.sendMessage(data.tabId, {
      type: 'dwlclear',
    });

    browser.downloads.download(
      {
        url: data.blob,
        filename: `${videoTitle}.x`,
      },
      downloadId => {
        worker.downloadId = downloadId;
      }
    );

    worker.active = false;
  }
};

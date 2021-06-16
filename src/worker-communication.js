const workerCommunication = (event) => {
  let data = event.data;
  let videoId = data.videoId;
  let videoInfo = videos[videoId];

  if (data.status === 'init') {
    let total = data.total;

    videos[videoId] = {
      ...videoInfo,
      total,
    };
  } else if (data.status === 'downloading') {
    let received = data.received;

    browser.tabs.sendMessage(videoInfo.tab, {
      type: 'dwlupdate',
      isAudio: data.isAudio,
      bytesTotal: videoInfo.total,
      bytesReceived: received,
    });

    videos[videoId] = {
      ...videoInfo,
      received,
    };
  } else if (data.status === 'complete') {
    let videoTitle = titles[videoId];

    browser.tabs.sendMessage(videoInfo.tab, {
      type: 'dwlclear',
    });

    browser.downloads.download(
      {
        url: data.blob,
        filename: `${videoTitle}.m4a`,
      },
      (downloadId) => {
        videos[videoId] = {
          ...videoInfo,
          downloadId,
        };
      }
    );
  }
};

browser.downloads.onChanged.addListener((event) => {
  if (event.state) {
    if (event.state.current === 'complete') {
      let downloadId = event.id;
      let videoId = getkeyByDownloadId(downloadId);
      let videoInfo = videos[videoId];

      videos[videoId] = {
        audio: videoInfo.audio,
        video: videoInfo.video,
        tab: videoInfo.tab,
      };
    }
  }
});

browser.extension.onRequest.addListener((request, sender, response) => {
  if (sender.tab.url.startsWith(extensionUrl)) {
    if (request.action && request.action === 'videoStates') {
      const data = {};

      for (const videoId in videos) {
        const videoInfo = videos[videoId];

        data[videoId] = {
          received: videoInfo.received,
          total: videoInfo.total,
          title: titles[videoId],
        };
      }

      response(data);
    }
  }
});

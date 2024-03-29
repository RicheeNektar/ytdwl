const workerMessageHandler = (event: MessageEvent<YTDwl.WorkerMessage>) => {
  const data = event.data;
  const tabId = data.tabId;

  const download = storage.getOrCreateDownload({ tabId, isAudio: false });

  switch (data.status) {
    case 'init':
      storage.updateDownload(tabId, { total: data.total });
      break;

    case 'downloading':
      const { received } = data;
      const { isAudio, total } = download;

      storage.updateDownload(tabId, { received });

      browser.tabs.sendMessage(tabId, {
        type: 'update_yt_progress',
        bytesReceived: received,
        bytesTotal: total,
        isAudio: isAudio,
      });

      break;

    case 'complete':
      let title = storage.getTitle(download.videoId);

      browser.tabs.sendMessage(data.tabId, {
        type: 'clear_yt_progress',
      });

      browser.downloads.download(
        {
          url: data.blob,
          filename: `${title}.${download.isAudio ? 'weba' : 'webm'}`,
        },
        downloadId =>
          storage.updateDownload(tabId, { downloadId, status: 'complete' })
      );
      break;

    case 'stream_link_changed':
      storage.updateStream(download.videoId, data.streamLink);
      break;
  }
};

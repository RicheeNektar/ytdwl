browser.runtime.onMessage.addListener(
  (data: YTDwl.RuntimeMessage, sender, response: (a?: any) => void) => {
    const senderTabId = sender.tab?.id;

    if (!senderTabId) {
      console.error('No tab defined');
      return;
    }

    switch (data.type) {
      case RuntimeMessageType.startDownload:
        startDownload({
          isAudio: data.isAudio,
          videoId: data.videoId,
          tabId: senderTabId,
        }).then(
          () => response({ isRejected: false }),
          message => response({ isRejected: true, message })
        );
        return true;

      case RuntimeMessageType.awaitVideoInfo:
        new Promise<void>(resolve => {
          const videoId = data.videoId;
          const start = new Date();

          const i = setInterval(() => {
            const end = new Date();
            const isAvailable = !!storage.getStreams(videoId);

            if (isAvailable || end.getTime() - start.getTime() > 10000) {
              console.log(isAvailable ? 'Received info' : 'Skipping..');
              clearInterval(i);
              resolve();
            }
          }, 200);
        }).then(response);

        return true;

      case RuntimeMessageType.getActiveDownloads:
        const downloads = storage.getDownloads();

        response(
          downloads.map(download => ({
            ...download,
            title: storage.getTitle(download.videoId),
          }))
        );

        return;

      case RuntimeMessageType.updateTitle:
        const { videoId, title, titles } = data;

        if (titles) {
          titles.forEach(storage.updateVideoTitle);
        } else if (title && videoId) {
          storage.updateVideoTitle({
            videoId,
            title,
          });
        }

        break;

      case RuntimeMessageType.highlightTab:
        const { tabId } = data;

        browser.tabs.get(tabId, tab =>
          browser.tabs.highlight({
            tabs: tab.index,
            windowId: tab.windowId,
          })
        );
        break;

      default:
        console.error('Unknown message: ', data);
    }

    response();
  }
);

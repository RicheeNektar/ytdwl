browser.runtime.onMessage.addListener((data, sender, response) => {
  switch (data.type) {
    case 'start_download':
    case 'cancel_download':
      startDownload(
        sender.tab.id,
        data.id,
        data.isAudio,
        data.type === 'cancel_download'
      ).then(
        worker => {
          worker.callback = () => response({ isRejected: false });
        },
        message => response({ isRejected: true, message })
      );
      return true;

    case 'await_video_info':
      new Promise(resolve => {
        const videoId = data.id;
        const start = new Date();

        const i = setInterval(() => {
          const end = new Date();

          if (!!videos[videoId] || end.getTime() - start.getTime() > 10000) {
            console.log(!!videos[videoId] ? 'Received info' : 'Skipping..');

            resolve();
            clearInterval(i);
          }
        }, 200);
      }).then(response);

      return true;

    case 'get_active_downloads':
      const downloads = [];

      Object.keys(tabsDownloading).forEach(id => {
        const info = tabsDownloading[id];

        if (
          typeof info.videoId === 'string' &&
          typeof info.total === 'number' &&
          typeof info.received === 'number'
        ) {
          downloads.push({
            tabId: parseInt(id),
            ...info,
          });
        }
      });

      response(
        downloads.map(download => ({
          title: titles[download.videoId],
          received: download.received,
          isAudio: download.isAudio,
          videoId: download.videoId,
          length: download.total,
          tabId: download.tabId,
        }))
      );
      return;

    case 'update_title':
      if (data.video) {
        if (Array.isArray(data.video)) {
          data.video.forEach(updateTitle);
        } else {
          // TODO: Get id from window.location.search
          updateTitle(data);
        }
      }

      break;

    case 'highlight_tab':
      browser.tabs.query(
        {
          currentWindow: true,
        },
        tabs => {
          const tab = tabs.find(tab => tab.id === data.tabId);
          browser.tabs.highlight({
            tabs: tab.index,
            windowId: tab.windowId,
          });
        }
      );
      break;

    default:
      console.error('Unknown message: ', data);
  }

  response();
});

browser.runtime.onMessage.addListener((data, sender, response) => {
  if (data.type) {
    if (data.type === 'start_download') {
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

    } else if (data.type === 'await_video_info') {
      new Promise(resolve => {
        const videoId = data.id;
        const start = new Date();

        const i = setInterval(() => {
          const end = new Date();

          if (!!videos[videoId] || end.getTime() - start.getTime() > 10000) {
            console.log(!!videos[videoId] ? 'Skipping..' : 'Received info');
            
            resolve();
            clearInterval(i);

          }
        }, 200);
      }).then(response);

      return true;

    } else if (data.type === 'get_active_downloads') {
      const downloads = [];

      Object.keys(tabsDownloading).forEach(id => {
        const info = tabsDownloading[id];

        if (info.videoId && info.total && info.received) {
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
    } else if (data.type === 'update_title') {
      const uri = data.search;

      if (uri.includes('v=')) {
        const videoId = getIDFromVid(uri);

        if (!titles[videoId]) {
          titles[videoId] = data.title;
          response();
        }
      }
    } else if (data.type === 'highlight_tab') {
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
    }
  }
});

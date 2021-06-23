browser.runtime.onMessage.addListener((data, _, response) => {
  if (data.type) {
    if (data.type === 'get_active_downloads') {
      const downloads = [];

      Object.keys(tabsDownloading).forEach(id =>
        downloads.push({
          tabId: parseInt(id),
          ...tabsDownloading[id],
        })
      );

      response(
        downloads.map(download => ({
          title: titles[download.videoId],
          received: download.received,
          isAudio: download.isAudio,
          videoId: download.videoId,
          active: download.active,
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

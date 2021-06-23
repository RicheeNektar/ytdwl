const generalize = props => ({
  ...props,
  contexts: ['all'],
  documentUrlPatterns: ['*://*.youtube.com/watch?*'],
});

browser.contextMenus.create(
  generalize({
    id: CONTEXT_DOWNLOAD_AUDIO,
    title: 'Download Audio',
  })
);

browser.contextMenus.create(
  generalize({
    id: CONTEXT_DOWNLOAD_VIDEO,
    title: 'Download Video',
  })
);

browser.contextMenus.create(
  generalize({
    id: CONTEXT_DOWNLOAD_CANCEL,
    title: 'Cancel Download',
  })
);

browser.contextMenus.create({
  id: CONTEXT_OPEN_DOWNLOADS,
  title: 'View downloads',
  contexts: ['all'],
  onclick: () => {
    openPage('html/index.html');
  },
});

async function handleContextOnClicked(info, tab) {
  if (
    tab.url.includes('watch') &&
    tab.url.includes('youtube.com') &&
    tab.url.includes('v=')
  ) {
    if (
      info.menuItemId === CONTEXT_DOWNLOAD_AUDIO ||
      info.menuItemId === CONTEXT_DOWNLOAD_VIDEO ||
      info.menuItemId === CONTEXT_DOWNLOAD_CANCEL
    ) {
      let videoId = getIDFromVid(tab.url);
      let videoInfo = videos[videoId];

      if (!titles[videoId]) {
        browser.tabs.executeScript(tab.id, {
          file: 'js/content.js',
        });

        await new Promise(r => setTimeout(r, 1000));
      }

      let worker = tabsDownloading[tab.id];
      if (!worker) {
        worker = new Worker('js/worker.js');

        worker.active = false;
        worker.onmessage = workerCommunication;

        tabsDownloading[tab.id] = worker;
      }

      if (videoInfo) {
        const isTabDownloading = worker.active;

        if (info.menuItemId === CONTEXT_DOWNLOAD_CANCEL && isTabDownloading) {
          worker.terminate();
          delete tabsDownloading[tab.id];

          browser.tabs.sendMessage(tab.id, {
            type: 'clear_yt_progress',
          });
        } else {
          if (isTabDownloading) {
            chrome.tabs.executeScript(tab.id, {
              code: 'alert("A download is already running in this tab.")',
            });
          } else {
            if (titles[videoId]) {
              const isAudio = info.menuItemId === CONTEXT_DOWNLOAD_AUDIO;

              worker.postMessage({
                action: 'start',
                isAudio,
                info: videoInfo,
                tabId: tab.id,
                videoId,
              });

              worker.videoId = videoId;
              worker.isAudio = isAudio;
            } else {
              browser.tabs.reload(tab.id);
            }
          }
        }
      }
    }
  }
}

browser.contextMenus.onClicked.addListener(handleContextOnClicked);

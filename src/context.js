const general = {
  contexts: ['all'],
  documentUrlPatterns: ['*://*.youtube.com/watch?*'],
};

browser.contextMenus.create({
  id: CONTEXT_DOWNLOAD_AUDIO,
  title: 'Download Audio',
  ...general
});

browser.contextMenus.create({
  id: CONTEXT_DOWNLOAD_VIDEO,
  title: 'Download Video',
  ...general
});

browser.contextMenus.create({
  id: CONTEXT_DOWNLOAD_CANCEL,
  title: 'Cancel Download',
  ...general
});

async function handleContextOnClicked(info, tab) {
  if (
    tab.url.includes('watch') &&
    tab.url.includes('youtube.com') &&
    tab.url.includes('v=')
  ) {
    let videoId = getIDFromVid(tab.url);
    let videoInfo = videos[videoId];

    if (!titles[videoId]) {
      browser.tabs.executeScript(tab.id, {
        file: 'js/content.js',
      });

      await new Promise((r) => setTimeout(r, 1000));
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
        tabsDownloading.splice(tab.id);

        browser.tabs.sendMessage(tab.id, {
          type: 'dwlclear',
        });

      } else {
        if (isTabDownloading) {
          chrome.tabs.executeScript(tab.id, {
            code: 'alert("A download is already running in this tab.")',
          });
        } else {
          if (titles[videoId]) {
            worker.postMessage({
              action: 'start',
              part: info.menuItemId,
              info: videoInfo,
              tabId: tab.id,
              videoId,
            });
          } else {
            browser.tabs.reload(tab.id);
          }
        }
      }
    }
  }
}

browser.contextMenus.onClicked.addListener(handleContextOnClicked);

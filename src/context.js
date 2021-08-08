const generalize = props => ({
  ...props,
  contexts: ['page'],
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
  contexts: ['page_action'],
  onclick: () => {
    openPage('html/index.html');
  },
});

function startDownload(tabId, videoId, isAudio, isCancelRequest) {
  return new Promise(async (resolve, reject) => {
    let videoInfo = videos[videoId];

    if (!titles[videoId]) {
      browser.tabs.executeScript(tabId, {
        file: 'js/content.js',
      });

      await new Promise(r => setTimeout(r, 1000));
    }

    let worker = tabsDownloading[tabId];
    if (!worker) {
      worker = new Worker('js/worker.js');

      worker.active = false;
      worker.onmessage = workerCommunication;

      tabsDownloading[tabId] = worker;
    }

    if (videoInfo && videoInfo.audio && videoInfo.video) {
      const isTabDownloading = worker.active;

      if (isCancelRequest && isTabDownloading) {
        worker.terminate();
        delete tabsDownloading[tabId];

        browser.tabs.sendMessage(tabId, {
          type: 'clear_yt_progress',
        });
      } else {
        if (isTabDownloading) {
          browser.tabs.executeScript(tabId, {
            code: 'alert("A download is running already in this tab.")',
          });

          reject('download_active');
        } else {
          if (titles[videoId]) {
            worker.postMessage({
              action: 'start',
              isAudio,
              info: videoInfo,
              videoId,
              tabId,
            });

            worker.videoId = videoId;
            worker.isAudio = isAudio;

            resolve(worker);
          } else {
            reject('no_video_title');
          }
        }
      }
    } else {
      reject('no_video_info');
    }
    
    reject('unknown');
  });
}

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
      const isAudio = info.menuItemId === CONTEXT_DOWNLOAD_AUDIO;
      const isCancelReqeust = info.menuItemId === CONTEXT_DOWNLOAD_CANCEL;

      startDownload(tab.id, getIDFromVid(tab.url), isAudio, isCancelReqeust);
    }
  }
}

browser.contextMenus.onClicked.addListener(handleContextOnClicked);

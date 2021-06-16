browser.contextMenus.create({
  id: CONTEXT_DOWNLOAD_AUDIO,
  title: 'Download Audio',
  contexts: ['all'],
  documentUrlPatterns: ['*://*.youtube.com/watch?*'],
});

browser.contextMenus.create({
  id: CONTEXT_DOWNLOAD_VIDEO,
  title: 'Download Video',
  contexts: ['all'],
  documentUrlPatterns: ['*://*.youtube.com/watch?*'],
});

let workersStarted = 0;

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
        file: 'content_scripts/title.js',
      });

      await new Promise((r) => setTimeout(r, 1000));
    }

    if (videoInfo && !videoInfo.total) {
      if (titles[videoId]) {
        let worker = new Worker('js/worker.js', {
          type: 'module',
        });

        worker.onmessage = workerCommunication;
        worker.postMessage({
          action: 'start',
          videoId,
          info: videoInfo,
          part: info.menuItemId,
        });
      } else {
        browser.tabs.reload(tab.id);
      }
    } else {
      alert("A download is already running in this tab.");
    }
  }
}

browser.contextMenus.onClicked.addListener(handleContextOnClicked);

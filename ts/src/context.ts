const generalize = (props: { id: string; title: string }) => ({
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
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (
    tab &&
    tab.id &&
    tab.url &&
    tab.url.includes('watch') &&
    tab.url.includes('youtube.com') &&
    tab.url.includes('v=')
  ) {
    const tabId = tab.id;

    switch (info.menuItemId) {
      case CONTEXT_DOWNLOAD_AUDIO:
      case CONTEXT_DOWNLOAD_VIDEO:
        const videoId = getIDFromVid(tab.url);

        if (videoId) {
          startDownload({
            tabId,
            videoId,
            isAudio: info.menuItemId === CONTEXT_DOWNLOAD_VIDEO,
          });
        }
        break;

      case CONTEXT_DOWNLOAD_CANCEL:
        startDownload({
          tabId,
          isCancelRequest: true,
        });
        break;

      case CONTEXT_OPEN_DOWNLOADS:
        openPage('html/index.html');
        break;

      default:
        console.warn('Unhandled context item: ', info.menuItemId);
    }
  }
});

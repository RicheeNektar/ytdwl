const getVideoIDFromTab = (tabId: number) => {
  return new Promise(resolve =>
    browser.tabs.sendMessage(
      tabId,
      {
        type: 'get_id',
      },
      // @ts-ignore
      null,
      resolve
    )
  );
};

browser.webRequest.onBeforeRequest.addListener(
  info => {
    if (info.initiator?.match(/https?:\/\/(?:www|m)\.youtube\.com/)) {
      browser.tabs.get(info.tabId, tab => {
        const stream = info.url.split('&range')[0];

        if (tab?.url && tab?.id) {
          if (tab.url.includes('youtube.com')) {
            const videoId = getIDFromVid(tab.url);

            if (videoId) {
              storage.updateStream(videoId, stream);
            }
          } else if (tab.url.includes(browser.runtime.id)) {
            getVideoIDFromTab(tab.id).then(videoId => {
              if (typeof videoId === 'string') {
                storage.updateStream(videoId, stream);
              }
            });
          }
        }
      });
    }
  },
  { urls: ['*://*/videoplayback?*'] }
);

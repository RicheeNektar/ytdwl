const getVideoIDFromTab = tab =>
  new Promise(resolve => {
    chrome.tabs.sendMessage(
      tab.id,
      {
        type: 'get_id',
      },
      null,
      resolve
    );
  });

const updateStream = (videoId, stream) => {
  const v = videos[videoId] ?? {};

  if (v?.audio !== stream && v?.video !== stream) {
    if (stream.includes('audio')) {
      v.audio = stream;
    } else if (stream.includes('video')) {
      v.video = stream;
    }
  }

  videos[videoId] = v;
};

browser.webRequest.onBeforeRequest.addListener(
  info => {
    if (info.initiator.match(/https?:\/\/(?:www|m)\.youtube\.com/)) {
      browser.tabs.get(info.tabId, tab => {
        const stream = info.url.split('&range')[0];

        if (tab?.url) {
          if (tab.url.includes('youtube.com')) {
            updateStream(getIDFromVid(tab.url), stream);
          } else if (tab.url.includes(browser.runtime.id)) {
            getVideoIDFromTab(tab).then(id => {
              if (!!id) {
                updateStream(id, stream);
              }
            });
          }
        }
      });
    }
  },
  { urls: ['*://*/videoplayback?*'] }
);

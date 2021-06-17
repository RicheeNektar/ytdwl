browser.webRequest.onBeforeRequest.addListener(
  info => {
    if (info.initiator.match(/https?:\/\/(?:www|m)\.youtube\.com/)) {
      browser.tabs.get(info.tabId, tab => {
        if (tab.url.includes('youtube.com')) {
          let videoId = getIDFromVid(tab.url);
          let stream = info.url.split('&range')[0];

          const v = videos[videoId] ?? { tab: info.tabId };

          if (v?.audio !== stream && v?.video !== stream) {
            if (info.url.includes('audio')) {
              v.audio = stream;
            } else if (info.url.includes('video')) {
              v.video = stream;
            }
          }

          videos[videoId] = v;
        }
      });
    }
  },
  { urls: ['*://*.googlevideo.com/videoplayback?*'] }
);

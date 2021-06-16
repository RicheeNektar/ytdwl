browser.webRequest.onBeforeRequest.addListener(
  (info) => {
    if (info.initiator.match(/https?:\/\/(?:www|m)\.youtube\.com/)) {
      browser.tabs.get(info.tabId, (tab) => {
        if (tab.url.includes('youtube.com')) {
          let videoId = getIDFromVid(tab.url);
          let stream = info.url.split('&range')[0];

          const v = videos[videoId] ?? { tab: info.tabId };

          if (v?.audio !== stream && v?.video !== stream) {
            if (info.url.includes('audio')) {
              videos[videoId] = {
                ...v,
                audio: stream,
              };
            } else if (info.url.includes('video')) {
              videos[videoId] = {
                ...v,
                video: stream,
              };
            }
          }
        }
      });
    }
  },
  { urls: ['*://*.googlevideo.com/videoplayback?*'] }
);

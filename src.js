// src/util.js

const videos = {};
const titles = {};


const CONTEXT_DOWNLOAD_VIDEO = 'downloadVideo';
const CONTEXT_DOWNLOAD_AUDIO = 'downloadAudio';


if (typeof browser === "undefined") {
  var browser = chrome;
}

const extensionUrl = (() => {
  const extensionUrl = browser.runtime.getURL("");
  return extensionUrl.substring(0, extensionUrl.length - 1);
})();

function getIDFromVid(vidurl) {
  let arguments = vidurl.split("?")[1].split("&");

  for (let i = 0; i < arguments.length; i++) {
    let argument = arguments[i];
    if (argument.startsWith("v")) {
      return argument.split("=")[1];
    }
  }

  return "";
}

function getkeyByDownloadId(downloadId) {
  for (let prop in videos) {
    if (videos[prop].downloadId === downloadId) {
      return prop;
    }
  }
}

// END OF FILE
// src/worker-communication.js

const workerCommunication = (event) => {
  let data = event.data;
  let videoId = data.videoId;
  let videoInfo = videos[videoId];

  if (data.status === 'init') {
    let total = data.total;

    videos[videoId] = {
      ...videoInfo,
      total,
    };
  } else if (data.status === 'downloading') {
    let received = data.received;

    browser.tabs.sendMessage(videoInfo.tab, {
      type: 'dwlupdate',
      isAudio: data.isAudio,
      bytesTotal: videoInfo.total,
      bytesReceived: received,
    });

    videos[videoId] = {
      ...videoInfo,
      received,
    };
  } else if (data.status === 'complete') {
    let videoTitle = titles[videoId];

    browser.tabs.sendMessage(videoInfo.tab, {
      type: 'dwlclear',
    });

    browser.downloads.download(
      {
        url: data.blob,
        filename: `${videoTitle}.m4a`,
      },
      (downloadId) => {
        videos[videoId] = {
          ...videoInfo,
          downloadId,
        };
      }
    );
  }
};

browser.downloads.onChanged.addListener((event) => {
  if (event.state) {
    if (event.state.current === 'complete') {
      let downloadId = event.id;
      let videoId = getkeyByDownloadId(downloadId);
      let videoInfo = videos[videoId];

      videos[videoId] = {
        audio: videoInfo.audio,
        video: videoInfo.video,
        tab: videoInfo.tab,
      };
    }
  }
});

// END OF FILE
// src/webRequest.js

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

// END OF FILE
// src/context.js

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
        let worker = new Worker('src/worker.js', {
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

// END OF FILE
// src/runtime.js

browser.runtime.onMessage.addListener((message, _, ok) => {
  console.log(message);
  if (message[0] === 'title') {
    let uri = message[1];

    if (uri.includes('v=')) {
      let videoId = getIDFromVid(uri);

      if (!titles[videoId]) {
        titles[videoId] = message[2];
        ok();
      }
    }
  }
});

// END OF FILE

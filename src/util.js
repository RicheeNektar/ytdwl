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

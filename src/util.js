const tabsDownloading = [];
const videos = {};
const titles = {};


const CONTEXT_DOWNLOAD_VIDEO = 'downloadVideo';
const CONTEXT_DOWNLOAD_AUDIO = 'downloadAudio';
const CONTEXT_DOWNLOAD_CANCEL = 'downloadCancel';


if (typeof browser === "undefined") {
  var browser = chrome;
}


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

function getWorkerByDownloadId(downloadId) {
  for (let prop in tabsDownloading) {
    if (tabsDownloading[prop].downloadId === downloadId) {
      return prop;
    }
  }
}

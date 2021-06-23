const CONTEXT_DOWNLOAD_VIDEO = 'downloadVideo';
const CONTEXT_DOWNLOAD_AUDIO = 'downloadAudio';

const xhr = new XMLHttpRequest();
const buffer = 1024 * 1024;

let streamLink;
let videoId;
let total;
let mime;
let url;

let isFinished = false;
let isAudio = false;
let current = 0;
let tabId = 0;
let index = 0;
let blobs = [];

const reset = () => {
  streamLink = null;
  isAudio = false;
  videoId = null;
  current = 0;
  tabId = 0;
  total = 0;
  blobs = [];
  index = 0;
  mime = null;
  url = null;
};

xhr.responseType = 'blob';
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {
    if (xhr.getResponseHeader('Content-Type') === 'text/plain') {
      streamLink = xhr.responseText;

      postMessage({
        status: 'stream_link_changed',
        tabId,
        isAudio,
        videoId,
        new_stream_link: xhr.responseText,
      })

    } else {
      blobs[index++] = xhr.response;
      current += xhr.response.size;

      postMessage({
        status: 'downloading',
        received: current,
        tabId,
        isAudio,
      });
    }
  }
};

async function download() {
  while (current < total && !isFinished) {
    xhr.open(
      'GET',
      streamLink + `&range=${current}-${current + buffer}`,
      false
    );
    xhr.send();
  }

  isFinished = true;
  postMessage({
    status: 'complete',
    blob: URL.createObjectURL(new Blob(blobs, { type: mime })),
    tabId,
    videoId,
  });
}

onmessage = event => {
  let data = event.data;

  if (data.action === 'start' && data.info && data.videoId) {
    reset();

    let info = data.info;
    videoId = data.videoId;
    tabId = data.tabId;
    isAudio = data.isAudio;
    
    streamLink = isAudio ? info.audio : info.video;

    mime = streamLink.match(/&mime=(audio|video)%2F.*?&/)[0].split('=')[1];
    mime = mime
      .substring(0, mime.length - 1)
      .split('%2F')
      .join('/');

    total = parseInt(streamLink.match(/clen=\d+/)[0].split('=')[1]);

    postMessage({
      status: 'init',
      total,
      tabId,
    });
    isFinished = false;

    download();
  }
};

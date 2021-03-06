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
xhr.onreadystatechange = async () => {
  if (xhr.readyState === 4) {
    const content = xhr.getResponseHeader('Content-Type');
    
    if (content === 'text/plain') {
      streamLink = await xhr.response.text();

      postMessage({
        status: 'stream_link_changed',
        tabId,
        isAudio,
        videoId,
        new_stream_link: streamLink,
      });

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

    if (isAudio) {
      total = parseInt(streamLink.match(/clen=(\d+)/)[1]);
    } else {
      const xhr1 = new XMLHttpRequest();
      xhr1.onreadystatechange = () => {
        if (xhr1.readyState === 4) {
          total = parseInt(xhr1.getResponseHeader('Content-Length'));
        }
      }
      xhr1.open('HEAD', streamLink, false);
      xhr1.send();
    }

    postMessage({
      status: 'init',
      total,
      tabId,
    });
    isFinished = false;

    download();
  }
};

const CONTEXT_DOWNLOAD_VIDEO = 'downloadVideo';
const CONTEXT_DOWNLOAD_AUDIO = 'downloadAudio';

const xhr = new XMLHttpRequest();
const buffer = 1024 * 1024;

let streamLink;
let total;

let isAudio = false;
let videoId = null;
let current = 0;
let blobs   = [];
let index   = 0;
let mime    = null;
let url     = null;

xhr.responseType = 'blob';
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {
    blobs[index++] = xhr.response;
    current += xhr.response.size;

    postMessage({
      status: 'downloading',
      received: current,
      videoId,
      isAudio,
    });
  }
};

async function download() {
  while (current < total) {
    xhr.open(
      'GET',
      streamLink + `&range=${current}-${current + buffer}`,
      false
    );
    xhr.send();
  }

  blobs = new Blob(blobs, { type: mime });
  url = URL.createObjectURL(blobs);

  postMessage({
    status: 'complete',
    blob: url,
    videoId,
  });
}

onmessage = event => {
  let data = event.data;

  if (data.action === 'start' && data.info && data.videoId) {
    let info = data.info;
    videoId = data.videoId;

    isAudio = data.part === CONTEXT_DOWNLOAD_AUDIO;
    streamLink = isAudio ? info.audio : info.video;

    mime = streamLink.match(/&mime=(audio|video)%2F.*?&/)[0].split('=')[1];
    mime = mime.substring(0, mime.length - 1).split('%2F').join('/');

    total = parseInt(streamLink.match(/clen=\d+/)[0].split('=')[1]);

    postMessage({
      status: 'init',
      total,
      videoId,
    });

    download();
  }
};

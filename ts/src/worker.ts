const xhr = new XMLHttpRequest();
const buffer = 1024 * 1024;

let streamLink: string | undefined;
let videoId: string | null;
let mime: string | null;
let url: string | null;
let total: number;

let isFinished = false;
let isAudio = false;
let current = 0;
let tabId = 0;
let index = 0;
let blobs: Blob[] = [];

const reset = () => {
  streamLink = undefined;
  videoId = null;
  mime = null;
  url = null;
  isAudio = false;
  current = 0;
  index = 0;
  tabId = 0;
  total = 0;
  blobs = [];
};

const sendMessage = (message: YTDwl.WorkerMessageProps) => {
  // @ts-ignore
  postMessage({
    ...message,
    tabId,
  });
};

xhr.responseType = 'blob';
xhr.onreadystatechange = async () => {
  if (xhr.readyState === 4) {
    const content = xhr.getResponseHeader('Content-Type');

    if (content === 'text/plain') {
      streamLink = await xhr.response.text();

      if (streamLink) {
        sendMessage({
          status: 'stream_link_changed',
          streamLink,
        });
      }
    } else {
      blobs[index++] = xhr.response;
      current += xhr.response.size;

      sendMessage({
        status: 'downloading',
        received: current,
      });
    }
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

  if (mime) {
    sendMessage({
      status: 'complete',
      blob: URL.createObjectURL(new Blob(blobs, { type: mime })),
    });
  }
}

const startWorker = () => {
  sendMessage({
    status: 'init',
    total,
  });

  download();
};

onmessage = (event: MessageEvent<YTDwl.WorkerControlMessage>) => {
  const {
    type,
    videoId,
    tabId: dataTabId,
    streams: { audio, video },
    isAudio,
  } = event.data;

  if (type === 'init' && audio && video && videoId) {
    reset();

    tabId = dataTabId;
    streamLink = isAudio ? audio : video;

    const mimeMatch = streamLink.match(/&mime=(audio|video)%2F.*?&/);

    if (mimeMatch) {
      mime = mimeMatch[0].split('=')[1];
      mime = mime
        .substring(0, mime.length - 1)
        .split('%2F')
        .join('/');

      const contentLength = streamLink.match(/clen=(\d+)/);

      if (!!contentLength) {
        total = parseInt(contentLength[1]);
        startWorker();
      } else {
        const xhr1 = new XMLHttpRequest();

        xhr1.onreadystatechange = () => {
          if (xhr1.readyState === 4) {
            const head = xhr1.getResponseHeader('Content-Length');

            if (head) {
              total = parseInt(head);
              startWorker();
            }
          }
        };

        xhr1.open('HEAD', streamLink, false);
        xhr1.send();
      }
    }
  }
};

const xhr = new XMLHttpRequest();
const buffer = 4096;

let streamLink: string | undefined;
let videoId: string | null;
let mime: string | null;
let url: string | null;

type memType = {
  isFinished: boolean;
  isAudio: boolean;
  current: number;
  index: number;
  tabId: number;
  total: number;
  blobs: Blob[];
};

let mem: memType = {
  isFinished: false,
  isAudio: false,
  current: 0,
  index: 0,
  tabId: 0,
  total: 0,
  blobs: [],
};

const reset = () => {
  mem.isAudio = false;
  mem.current = 0;
  mem.index = 0;
  mem.tabId = 0;
  mem.total = 0;
  mem.blobs = [];
};

const sendMessage = (message: YTDwl.WorkerMessageProps) => {
  // @ts-ignore
  postMessage({
    ...message,
    tabId: mem.tabId,
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
      mem.blobs[mem.index++] = xhr.response;
      mem.current += xhr.response.size;

      sendMessage({
        status: 'downloading',
        received: mem.current,
      });
    }
  }
};

async function download() {
  while (mem.current < mem.total) {
    xhr.open(
      'GET',
      streamLink + `&range=${mem.current}-${mem.current + buffer}`,
      false
    );
    xhr.send();
  }

  if (mime) {
    sendMessage({
      status: 'complete',
      blob: URL.createObjectURL(new Blob(mem.blobs, { type: mime })),
    });
  }
}

const startWorker = () => {
  sendMessage({
    status: 'init',
    total: mem.total,
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

    mem.tabId = dataTabId;
    mem.isAudio = isAudio;

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
        mem.total = parseInt(contentLength[1]);
        startWorker();
      } else {
        const xhr1 = new XMLHttpRequest();

        xhr1.onreadystatechange = () => {
          if (xhr1.readyState === 4) {
            const head = xhr1.getResponseHeader('Content-Length');

            if (head) {
              mem.total = parseInt(head);
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

const createStore = () => {
  const storage: YTDwl.Store = {
    downloads: {},
    streams: {},
    titles: {},
  };

  return {
    updateVideoTitle: ({ videoId, title }: YTDwl.Video) =>
      (storage.titles[videoId] = title.replaceAll(/[^a-z0-9 !]/gi, '').replaceAll(/  +/g, ' ').trim()),

    getTitle: (videoId: string) => storage.titles[videoId],

    getStreams: (videoId: string) => storage.streams[videoId],

    getDownloads: () =>
      Object.keys(storage.downloads).map(idKey => {
        const tabId = parseInt(idKey);

        return {
          ...storage.downloads[tabId],
          tabId,
        };
      }),

    updateStream: (videoId: string, stream: string) => {
      const streams = {
        ...storage.streams[videoId],
      };

      if (stream.includes('audio')) {
        streams.audio = stream;
      } else {
        streams.video = stream;
      }

      storage.streams[videoId] = streams;
    },

    updateDownload: (tabId: number, newProps: Partial<YTDwl.Download>) => {
      storage.downloads[tabId] = {
        ...storage.downloads[tabId],
        ...newProps,
      };
    },

    cancelDownload: (tabId: number) => {
      const download = storage.downloads[tabId];

      if (download) {
        download.worker.terminate();
        delete storage.downloads[tabId];
      }
    },

    getOrCreateDownload: ({
      tabId,
      videoId,
      isAudio,
    }: {
      tabId: number;
      videoId?: string;
      isAudio: boolean;
    }) => {
      const download = storage.downloads[tabId];

      if (videoId) {
        if (!download) {
          const worker = new Worker('src/worker.js');
          worker.onmessage = workerMessageHandler;

          return (storage.downloads[tabId] = {
            isAudio,
            status: 'complete',
            videoId,
            worker,
          });
        } else {
          return (storage.downloads[tabId] = {
            ...download,
            videoId,
            isAudio
          });
        }
      }

      return download;
    },

    print: () => console.log(storage),
  };
};

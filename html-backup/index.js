let storedDownloads = [];
let downloadQueue = [];
let errorQueue = [];

let downloadListItemTemplate;
let playlistItemTemplate;
let fetchingPlaylist;
let downloadAudio;
let overviewList;
let customTab;
let playList;
let youtube;
let selfTab;

const thumbSizes = ['default', 'hqdefault', 'maxresdefault'];

if (typeof browser === 'undefined') {
  var browser = chrome;
}

browser.tabs.getCurrent(tab => {
  console.log(tab);
  selfTab = tab;
});

const applyProgress = (progress, isAudio, received, length) => {
  progress.style.background = isAudio ? '#773004' : '#808';
  progress.style.width = `${(received / length) * 100.0}%`;
};

const getPlaylistId = link =>
  new URL(link).search
    .substring(1)
    .split('&')
    .map(param => param.split('='))
    .find(param => param[0] === 'list')[1];

const updateDownload = (downloadHtml, { videoId, isAudio, title }) => {
  const titleHtml = downloadHtml.querySelector('#title');
  const mime = downloadHtml.querySelector('#mime');

  titleHtml.innerHTML = title;
  mime.innerHTML = isAudio ? 'Audio (.weba)' : 'Video (.webm)';

  thumbSizes.forEach(size => {
    const pictureSource = downloadHtml.querySelector(`#${size}`);
    pictureSource.srcset = `https://i.ytimg.com/vi/${videoId}/${size}.jpg`;
  });
};

const createDownloadItem = ({
  tabId,
  videoId,
  isAudio,
  hasErrored,
  title,
  received,
  length,
}) => {
  const clone = downloadListItemTemplate.content.cloneNode(true);

  const progress = clone.getElementById('progress-bar');
  const root = clone.getElementById('tab-X');

  root.id = `tab-${tabId}`;
  root.onclick = () => {
    if (tabId !== selfTab.id && Number.isInteger(tabId)) {
      browser.tabs.get(
        tabId,
        ({ index, windowId }) =>
          browser.tabs.highlight({
            tabs: index,
            windowId,
          })
      );
    }
  };

  if (hasErrored === true) {
    root.style.backgroundColor = '#a33';
  }

  applyProgress(progress, isAudio, received, length);
  updateDownload(clone, { videoId, isAudio, title });

  return clone;
};

const createVideoItem = (video, hasErrored) => {
  return createDownloadItem({
    hasErrored,
    isAudio: downloadAudio.checked,
    videoId: video.id,
    title: video.title,
    tabId: video.id,
    received: 0,
    length: 1,
  });
};

const updateDownloads = downloads => {
  const queryListItem = tabId => overviewList.querySelector(`#tab-${tabId}`);
  const compareNewAndStoredTabId = (stored, download) =>
    stored.tabId === download.tabId;

  if (storedDownloads.length > 0) {
    // Remove excess downloads
    storedDownloads
      .filter(
        stored =>
          !downloads.find(download =>
            compareNewAndStoredTabId(stored, download)
          )
      )
      .forEach(stored => {
        queryListItem(stored.tabId).remove();
        storedDownloads.splice(storedDownloads.indexOf(stored));
      });
  }

  if (downloads.length > 0) {
    // Append missing downloads
    downloads
      .filter(
        download =>
          !storedDownloads.find(stored =>
            compareNewAndStoredTabId(stored, download)
          )
      )
      .forEach(download => {
        overviewList.appendChild(createDownloadItem(download));
        storedDownloads.push(download);
      });

    // Update html
    storedDownloads.forEach(stored => {
      const download = downloads.find(
        download => stored.tabId === download.tabId
      );
      const downloadHtml = queryListItem(stored.tabId);

      if (
        download &&
        !(
          download.videoId === stored.videoId &&
          download.isAudio === stored.isAudio &&
          download.title === stored.title
        )
      ) {
        updateDownload(downloadHtml, download);
      }

      applyProgress(
        downloadHtml.querySelector('#progress-bar'),
        stored.isAudio,
        stored.received,
        stored.length
      );
    });

    // Update existing downloads
    downloads.forEach(
      download =>
      (storedDownloads[
        storedDownloads.findIndex(stored =>
          compareNewAndStoredTabId(stored, download)
        )
      ] = download)
    );
  }
};

const updatePlaylist = () =>
  playList.replaceChildren(
    ...downloadQueue.map(dwl => createVideoItem(dwl, false)),
    ...errorQueue.map(dwl => createVideoItem(dwl, true))
  );

const sendMessage = (message, response) =>
  browser.runtime.sendMessage(message, response);

const processQueue = () =>
  new Promise(async (resolve, reject) => {
    const video = downloadQueue.shift();
    updatePlaylist();

    if (video) {
      youtube.src = `https://www.youtube.com/embed/${video.id}?mute=1&autoplay=1`;

      await new Promise(resolve => (youtube.onload = resolve));

      sendMessage(
        {
          type: 'start_download',
          isAudio: downloadAudio.checked,
          id: video.id,
        },
        async ({ isRejected, message }) => {
          if (isRejected) {
            if (message === 'no_video_info') {
              const url = `https://www.youtube.com/watch?v=${video.id}`;

              if (customTab) {
                browser.tabs.update(customTab.id, {
                  active: true,
                  url,
                });
              } else {
                customTab = await new Promise(resolve => browser.tabs.create(
                  {
                    url
                  },
                  resolve
                ));
              }

              sendMessage(
                {
                  type: 'await_video_info',
                  id: video.id,
                },
                () => {
                  sendMessage(
                    {
                      type: 'start_download',
                      isAudio: downloadAudio.checked,
                      id: video.id,
                    },
                    ({ isRejected, message }) => {
                      if (isRejected) {
                        console.log(message);
                        errorQueue.unshift(video);
                      }

                      resolve();
                    }
                  );
                }
              )

            } else {
              console.log(message);
              errorQueue.unshift(video);

              resolve();
            }
          } else {
            resolve();
          }
        }
      );
    } else {
      reject('empty_queue');
    }
  }).then(processQueue, reason => {
    if (reason === 'empty_queue') {
      youtube.src = '';
    } else {
      console.log(reason);
    }
  });

setInterval(() => {
  if (
    !downloadListItemTemplate ||
    !playlistItemTemplate ||
    !fetchingPlaylist ||
    !downloadAudio ||
    !overviewList ||
    !playlistForm ||
    !playList ||
    !youtube
  ) {
    downloadListItemTemplate = document.getElementById('overview-list-item');
    playlistItemTemplate = document.getElementById('playlist-item');
    fetchingPlaylist = document.getElementById('fetching-playlist');
    downloadAudio = document.getElementById('audio');
    overviewList = document.getElementById('overview-list');
    playlistForm = document.getElementById('playlist-form');
    playList = document.getElementById('play-list');
    youtube = document.getElementById('youtube');

    playlistForm.onsubmit = e => {
      e.preventDefault();
      fetchingPlaylist.hidden = false;

      fetchPlaylist(getPlaylistId(e.target[0].value)).then(videos => {
        fetchingPlaylist.hidden = true;
        downloadQueue = videos;
        errorQueue = [];

        updatePlaylist();

        videos.forEach(video =>
          browser.runtime.sendMessage(null, {
            type: 'update_title',
            search: `https://www.youtube.com/watch?v=${video.id}`,
            title: video.title,
          })
        );

        processQueue();
      });
    };
  } else {
    browser.runtime.sendMessage(
      null,
      {
        type: 'get_active_downloads',
      },
      null,
      updateDownloads
    );
  }
}, 200);

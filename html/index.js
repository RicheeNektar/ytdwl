let storedDownloads = [];
let templateListItem;
let list;

const thumbSizes = ['default', 'hqdefault', 'maxresdefault'];

if (typeof browser === 'undefined') {
  var browser = chrome;
}

const applyProgress = (progress, isAudio, received, length) => {
  progress.style.background = isAudio ? '#773004' : '#808';
  progress.style.width = `${(received / length) * 100.0}%`;
};

const createDownloadItem = download => {
  const tabId = download.tabId;
  const videoId = download.videoId;
  const isAudio = download.isAudio;

  const clone = templateListItem.content.cloneNode(true);

  const root = clone.getElementById('tab-X');
  root.id = `tab-${tabId}`;
  root.onclick = () => {
    browser.tabs.query(
      {
        url: `*://*.youtube.com/watch?*v=${videoId}*`,
      },
      tab =>
        browser.tabs.highlight({
          tabs: tab[0].index,
          windowId: tab[0].windowId,
        })
    );
  };

  const title = clone.getElementById('title');
  title.innerHTML = download.title;

  const mime = clone.getElementById('mime');
  mime.innerHTML = isAudio ? 'Audio (.weba)' : 'Video (.webm)';

  const progress = clone.getElementById('progress-bar');
  applyProgress(progress, isAudio, download.received, download.length);

  thumbSizes.forEach(size => {
    const pictureSource = clone.getElementById(size);
    pictureSource.srcset = `https://i.ytimg.com/vi/${videoId}/${size}.jpg`;
  });

  return clone;
};

const updateDownloads = downloads => {
  const queryListItem = tabId => list.querySelector(`#tab-${tabId}`);
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
        list.appendChild(createDownloadItem(download));
        storedDownloads.push(download);
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

    // Update html
    storedDownloads.forEach(stored =>
      applyProgress(
        queryListItem(stored.tabId).querySelector('#progress-bar'),
        stored.isAudio,
        stored.received,
        stored.length
      )
    );
  }
};

setInterval(() => {
  if (!templateListItem || !list) {
    list = document.getElementById('overview-list');
    templateListItem = document.getElementById('overview-list-item');
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

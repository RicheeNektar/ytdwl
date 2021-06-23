let storedDownloadJson;
let templateListItem;
let list;

const thumbSizes = ['default', 'hqdefault', 'maxresdefault'];

if (typeof browser === 'undefined') {
  var browser = chrome;
}

const updateList = newChildren => {
  list.replaceChildren(...newChildren);
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
      downloads => {
        const downloadJson = JSON.stringify(downloads);

        if (storedDownloadJson !== downloadJson) {
          storedDownloadJson = downloadJson;

          updateList(
            downloads.map(download => {
              const tabId = download.tabId;
              const videoId = download.videoId;
              const isAudio = download.isAudio;
              const progressPerc = download.received / download.length * 100.0;
              const barColor = isAudio ? '#773004' : '#808';

              const clone = templateListItem.content.cloneNode(true);

              const root = clone.getElementById('tab-X');
              root.id = `tab-${tabId}`;

              const title = clone.getElementById('title');
              title.innerHTML = download.title;
              
              const mime = clone.getElementById('mime');
              mime.innerHTML = isAudio ? 'Audio (.weba)' : 'Video (.webm)';
              
              const progress = clone.getElementById('progress-bar');
              progress.style.background = barColor;
              progress.style.width = `${progressPerc}%`;

              thumbSizes.forEach(size => {
                const pictureSource = clone.getElementById(size);
                pictureSource.srcset = `https://i.ytimg.com/vi/${videoId}/${size}.jpg`;
              });

              return clone;
            })
          );
        }
      }
    );
  }
}, 200);

let previousTitle = '';
let titleElement: HTMLElement;
let isDarkMode = false;

const colors = [
  ['#0f0', '#87cefa', '#999'],
  ['#808', '#773004', '#666'],
];

// @ts-ignore
if (typeof browser === 'undefined') {
  // @ts-ignore
  var browser = chrome;
}

const renderStyle = (isAudio: boolean, progress: number) =>
  `linear-gradient(90deg, ${colors[isDarkMode ? 1 : 0][isAudio ? 1 : 0]} ${
    progress * 100
  }%, ${colors[isDarkMode ? 1 : 0][2]} 0%)`;

browser.runtime.onMessage.addListener((msg: any) => {
  const type = msg.type;

  if (type === 'update_yt_progress') {
    titleElement.style.background = renderStyle(
      msg.isAudio,
      msg.bytesReceived / msg.bytesTotal
    );
  } else if (type === 'clear_yt_progress') {
    titleElement.style.background = '';
  }
});

const getVideoId = () => new URL(window.location.href).searchParams.get('v');

setInterval(() => {
  isDarkMode = document.querySelector('html')?.getAttribute('dark') !== null;

  let search = window.location.search;

  if (search.includes('v=')) {
    let elements = document.querySelectorAll('h1[class="style-scope ytd-watch-metadata"]');

    if (elements.length > 0) {
      titleElement = <HTMLElement>elements[0];
      let title = titleElement.textContent;

      if (title && previousTitle !== title) {
        let videoId = getVideoId();

        if (videoId) {
          browser.runtime.sendMessage(
            {
              type: RuntimeMessageType.updateTitle,
              videoId,
              title,
            },
            () => {
              if (title) {
                previousTitle = title;
              }
            }
          );
        }
      }
    }
  }
}, 200);

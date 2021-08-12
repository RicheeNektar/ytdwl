let previousTitle = '';
let titleElement: HTMLElement;
let isDarkMode = false;

const colors = [
  ['#0f0', '#87cefa', '#999'],
  ['#808', '#773004', '#666'],
];

// @ts-ignore
if (typeof browser === 'undefined') {
  var browser = chrome;
}

const renderStyle = (isAudio: boolean, progress: number) =>
  `linear-gradient(90deg, ${colors[isDarkMode ? 1 : 0][isAudio ? 1 : 0]} ${
    progress * 100
  }%, ${colors[isDarkMode ? 1 : 0][2]} 0%)`;

browser.runtime.onMessage.addListener(msg => {
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
  const search = window.location.search;

  if (search.includes('v=')) {
    const className =
      window.location.href.includes('m.youtube') &&
      !search.includes('app=desktop')
        ? 'slim-video-metadata-title'
        : 'title style-scope ytd-video-primary-info-renderer';

    const elements = document.getElementsByClassName(className);
    isDarkMode =
      document.querySelector('html')?.getAttribute('dark') === 'true';
    
    if (elements.length > 0) {
      titleElement = <HTMLElement>elements[0];
      const title = titleElement.textContent;

      if (title && previousTitle !== title) {
        const videoId = getVideoId();

        if (videoId) {
          browser.runtime.sendMessage(
            {
              type: RuntimeMessageType.updateTitle,
              videoId,
              title,
            },
            () => (previousTitle = title)
          );
        }
      }
    }
  }
}, 200);

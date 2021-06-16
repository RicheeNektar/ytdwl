let colorSets = [['lime', 'lightskyblue', '#999'], ['#030', '#004', '#111']];
let isDarkMode = false;
let previousTitle = undefined;
let titleElement = undefined;

if (typeof browser === "undefined") {
  var browser = chrome;
}

const renderStyle = (isAudio, progress) =>
  `linear-gradient(90deg, ${colorSets[isDarkMode * 1][isAudio * 1]} ${
    progress * 100
  }%, ${colorSets[isDarkMode * 1][2]} 0%)`;

browser.runtime.onMessage.addListener((msg) => {
  const type = msg.type;

  if (type === "dwlupdate") {
    titleElement.style.background = renderStyle(
      msg.isAudio,
      msg.bytesReceived / msg.bytesTotal
    );
  } else if (type === "dwlclear") {
    titleElement.style.background = '';
  }
});

setInterval(() => {
  let search = window.location.search;
  let ytBackgroundColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--yt-spec-brand-background-solid');

  if (search.includes("v=")) {
    const className =
      window.location.href.includes("m.youtube") &&
      !search.includes("app=desktop")
        ? "slim-video-metadata-title"
        : "title style-scope ytd-video-primary-info-renderer";

    titleElement = document.getElementsByClassName(className)[0];

    if (titleElement) {
      let title = titleElement.textContent;

      if (title.length > 0) {
        title = title.replace(/[<>:"\/\\|?*]/g, "-");

        if (previousTitle !== title) {
          try {
            browser.runtime.sendMessage(
              browser.runtime.id,
              ["title", window.location.search, title],
              () => {
                previousTitle = title;
              }
            );
          } catch (e) {
            previousTitle = title;
          }
        }
      }
    }
  }

  isDarkMode = ytBackgroundColor === ' #212121';
}, 200);

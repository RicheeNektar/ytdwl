let previousTitle = undefined;
let titleElement = undefined;
let isDarkMode = false;

const colors = [
  [
    "#0f0", "#87cefa", "#999"
  ],
  [
    "#808", "#773004", "#666"
  ]
];

if (typeof browser === "undefined") {
  var browser = chrome;
}

const renderStyle = (isAudio, progress) =>
  `linear-gradient(90deg, ${colors[isDarkMode + 0][isAudio + 0]} ${
    progress * 100
  }%, ${colors[isDarkMode + 0][2]} 0%)`;

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

  if (search.includes("v=")) {
    const className =
      window.location.href.includes("m.youtube") &&
      !search.includes("app=desktop")
        ? "slim-video-metadata-title"
        : "title style-scope ytd-video-primary-info-renderer";

    isDarkMode = document.querySelector('html').getAttribute('dark') === "true";
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
}, 200);

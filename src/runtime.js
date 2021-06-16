browser.runtime.onMessage.addListener((message, _, ok) => {
  console.log(message);
  if (message[0] === 'title') {
    let uri = message[1];

    if (uri.includes('v=')) {
      let videoId = getIDFromVid(uri);

      if (!titles[videoId]) {
        titles[videoId] = message[2];
        ok();
      }
    }
  }
});

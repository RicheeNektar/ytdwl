const fetchPlaylist = playlistId =>
  new Promise(resolve => {
    if (playlistId === 'dev') {

      resolve(playlist_data);

    } else {
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === xhr.DONE) {
          resolve(JSON.parse(xhr.responseText));
        }
      };

      xhr.open(
        'GET',
        `https://richee.me/playlist/?list=${playlistId}`
      );
      xhr.send();
    }
  });

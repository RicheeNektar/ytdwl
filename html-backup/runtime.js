browser.runtime.onMessage.addListener((data, sender, response) => {
  if (data.type === 'get_id') {
    response(current_downloading);
  }
});
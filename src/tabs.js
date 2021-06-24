chrome.tabs.onRemoved.addListener(tabId => {
  const worker = tabsDownloading[tabId];

  if (worker) {
    worker.terminate();
  }

  delete tabsDownloading[tabId];
});

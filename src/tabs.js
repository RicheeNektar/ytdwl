chrome.tabs.onRemoved.addListener(tabId => {
  const worker = tabsDownloading[tabId];

  if (worker) {
    worker.terminate();
  }

  tabsDownloading.splice(tabId);
});

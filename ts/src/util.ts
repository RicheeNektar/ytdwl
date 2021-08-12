// @ts-ignore
if (typeof(browser) === 'undefined') {
  var browser = chrome;
}

const storage = createStore();

const getIDFromVid = (url: string) => new URL(url).searchParams.get('v');

const openPage = (page: string) =>
  browser.tabs.create({
    url: browser.runtime.getURL(page),
  });

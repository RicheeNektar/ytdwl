import mockBrowser from 'mock/mock-browser';

if (!window.stored || !window.stored.browser) {
  const checkBrowser = (browser: any) =>
    !!browser?.runtime?.sendMessage ? browser : null;

  const api =
    checkBrowser(window.browser) ??
    checkBrowser(window.chrome) ??
    mockBrowser();

  window.stored = {
    tab: undefined,
    browser: {
      sendMessage: async <T>(message: YTDwl.RuntimeMessage): Promise<T | null> => {
        console.debug('Sending message: ', message.type);

        return await new Promise(resolve =>
          api.runtime.sendMessage(null, message, null, (data: any) => {
            console.debug('Response: ', data);
            resolve(data);
          })
        );
      },

      addMessageListener: (
        callback: (message: YTDwl.RuntimeMessage, response: (p: any) => void) => void
      ) => {
        api.runtime.onMessage.addListener(
          (message: YTDwl.RuntimeMessage, _sender: any, response: (p: any) => void) => {
            console.debug('Received message: ', message.type);
            callback(message, response);
          }
        );
      },

      updateOrCreateTab: async (url: string) => {
        const tab = window.stored?.tab;

        if (!tab) {
          window.stored.tab = await new Promise(resolve =>
            api.tabs.create({ url }, resolve)
          );
        } else {
          api.tabs.update(tab.id, {
            active: true,
            url,
          });
        }
      },
    },
  };
}

export default window.stored.browser;

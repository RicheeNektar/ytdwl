import mockBrowser from 'mock/get-browser-mock';

const checkBrowser = (browser: any) =>
  !!browser?.runtime?.sendMessage ? browser : null;

const api =
  checkBrowser(window.browser) ?? checkBrowser(window.chrome) ?? mockBrowser();

const browser: Browser = {
  sendMessage: async <T>(message: CallMessage): Promise<T> => {
    return await new Promise(resolve =>
      api.runtime.sendMessage(null, message, null, resolve)
    );
  },
};

export default browser;

import MessageType from 'types/browser-message-types';
import downloads from './downloads';

const mockBrowser = () => ({
  runtime: {
    sendMessage: (
      _a: any,
      message: YTDwl.RuntimeMessage,
      _b: any,
      response: (param1?: any) => void
    ) => {
      console.debug(`Called '${message.type}'`);

      switch (message.type) {
        case MessageType.getActiveDownloads:
          response(downloads);
          break;

        case MessageType.startDownload:
          const responseObject: YTDwl.DownloadResponse = {
            isRejected: false,
          };

          response(responseObject);
          break;

        case MessageType.awaitVideoInfo:
          new Promise(async resolve => {
            await new Promise(resolve => setTimeout(resolve, 3000));
            resolve(null);
          }).then(() => response());

          break;

        default:
          console.debug(`Called unhandled MessageType: ${message.type}`);
          response(null);
          break;
      }
    },
  },
  tabs: {
    create: ({ url }: { url: string }, callback: (tab: Tab) => void) => {
      console.debug(`Created tab with url: '${url}'`);

      callback({
        id: -1,
        index: -1,
        windowId: -1,
        status: 'complete',
        url,
      });
    },
    update: (tabId: number, { url }: { url: string }) => {
      console.debug(`Update tab ${tabId}: set url: '${url}'`);
    },
  },
});

export default mockBrowser;

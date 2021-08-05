import MessageType from 'types/browser-message-types';
import downloads from './downloads';

const mockBrowser = () => ({
  runtime: {
    sendMessage: (
      _a: any,
      message: CallMessage,
      _b: any,
      response: (param1: any) => void
    ) => {
      switch (message.type) {
        case MessageType.getActiveDownloads:
          response(downloads);
          break;

        default:
          console.warn(`Called unhandled MessageType: ${message}`);
          response(null);
          break;
      }
    },
  },
});

export default mockBrowser;

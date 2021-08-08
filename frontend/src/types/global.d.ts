import MessageType from './browser-message-types';

declare global {
  export interface Window extends any {
    stored: {
      browser: Browser;
      tab?: Tab;
    };
    browser: any;
    chrome: any;
  }

  export interface Video {
    id: string;
    title: string;
  }

  export interface Download {
    title: string;
    tabId: number;
    active: boolean;
    videoId: string;
    isAudio: boolean;
    length: number;
    received: number;
  }

  export interface Tab {
    id: number;
    url: string;
    index: number;
    windowId: number;
    status: TabStatus;
  }

  export type TabStatus = 'unloaded' | 'loading' | 'complete';

  export type CallMessage =
    | {
        type: MessageType.startDownload;
        isAudio: boolean;
        id: string;
      }
    | {
        type: MessageType.awaitVideoInfo;
        id: string;
      }
      | {
        type: MessageType.updateTitle;
        video: Video | Video[];
      }
    | {
        type: MessageType;
      };

  export type DownloadResponse =
    | {
        isRejected: true;
        message: 'no_video_info' | 'download_active' | 'unknown';
      }
    | {
        isRejected: false;
      };

  export interface Browser {
    sendMessage: <T>(message: CallMessage) => Promise<T | null>;

    addMessageListener: (
      callback: (message: CallMessage, response: (p: any) => void) => void
    ) => void;

    updateOrCreateTab: (url: string) => Promise<void>;
  }
}

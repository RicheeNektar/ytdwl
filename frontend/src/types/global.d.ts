import MessageType from './browser-message-types';

declare global {
  export interface Window extends any {
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
    total: number;
    received: number;
  }

  export interface CallMessage {
    type: MessageType;
  }

  export interface Browser {
    sendMessage: <T>(message: CallMessage) => Promise<T>;
  }
}

declare global {
  export interface Window extends any {
    stored: {
      browser: Browser;
      tab?: Tab;
    };
    browser: any;
    chrome: any;
  }

  export interface Tab {
    id: number;
    url: string;
    index: number;
    windowId: number;
    status: TabStatus;
  }

  export type TabStatus = 'unloaded' | 'loading' | 'complete';

  export interface Browser {
    sendMessage: <T>(message: YTDwl.RuntimeMessage) => Promise<T | null>;

    addMessageListener: (
      callback: (
        message: YTDwl.RuntimeMessage,
        response: (p: any) => void
      ) => void
    ) => void;

    updateOrCreateTab: (url: string) => Promise<void>;
  }
}

export {};
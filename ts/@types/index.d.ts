// @ts-ignore
/// <reference types="chrome" />
declare namespace YTDwl {
  export interface Streams {
    audio?: string;
    video?: string;
  }

  export interface Download {
    status: 'active' | 'complete';
    worker: Worker;
    isAudio: boolean;
    
    downloadId?: number;
    received?: number;
    total?: number;

    tabId?: number;
    title?: string;

    videoId: string;
  }

  export interface Store {
    downloads: { [key: number]: Download };
    streams: { [key: string]: Streams };
    titles: { [key: string]: string };
  }

  export type WorkerMessageProps =
    | {
        status: 'init';
        total: number;
      }
    | {
        status: 'downloading';
        received: number;
      }
    | {
        status: 'complete';
        blob: string;
      }
    | {
        status: 'stream_link_changed';
        streamLink: string;
      };

  export type WorkerMessage = {
    tabId: number;
  } & WorkerMessageProps;

  export type WorkerControlMessage = {
    type: 'init';
    tabId: number;
    videoId: string;
    isAudio: boolean;
    streams: Streams;
  };

  export type Video = {
    videoId: string;
    title: string;
  };

  export type RuntimeMessage =
    | {
        type: RuntimeMessageType.startDownload;
        isAudio: boolean;
        videoId: string;
      }
    | {
        type: RuntimeMessageType.awaitVideoInfo;
        videoId: string;
      }
    | {
        type: RuntimeMessageType.updateTitle;
        videoId?: string;
        title?: string;
        titles?: Video[];
      }
    | {
        type: RuntimeMessageType.highlightTab;
        tabId: number;
      }
    | {
        type:
          | RuntimeMessageType.getActiveDownloads
          | RuntimeMessageType.getId;
      };

  export type DownloadResponse =
    | {
        isRejected: true;
        message:
          | 'no_video_title'
          | 'no_video_info'
          | 'no_video_id'
          | 'download_active';
      }
    | {
        isRejected: false;
      };

  // @ts-ignore
  export const browser: typeof chrome;
}

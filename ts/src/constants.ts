const CONTEXT_DOWNLOAD_CANCEL = 'CONTEXT_DOWNLOAD_CANCEL';
const CONTEXT_DOWNLOAD_VIDEO = 'CONTEXT_DOWNLOAD_VIDEO';
const CONTEXT_DOWNLOAD_AUDIO = 'CONTEXT_DOWNLOAD_AUDIO';
const CONTEXT_OPEN_DOWNLOADS = 'CONTEXT_OPEN_DOWNLOADS';

const enum RuntimeMessageType {
  // Worker -> Extension
  startDownload = 'start_download',
  awaitVideoInfo = 'await_video_info',

  // Frontend -> Extension
  // Content -> Extension
  updateTitle = 'update_title',
  highlightTab = 'highlight_tab',

  // Frontend -> Extension
  getActiveDownloads = 'get_active_downloads',

  // WebRequest -> Frontend
  getId = 'get_id',
}
import DownloadsListSaga from 'features/downloads-list/redux/saga';
import PlaylistFetchSaga from 'features/playlist-fetch/redux/saga';
import DownloadSaga from './sagas/download';

const sagas = [PlaylistFetchSaga, DownloadsListSaga, DownloadSaga];

export default sagas;

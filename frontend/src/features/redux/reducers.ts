import { combineReducers } from 'redux';
import PlaylistFetchReducer from 'features/playlist-fetch/redux/slice';
import DownloadsListReducer from 'features/downloads-list/redux/slice';

export default combineReducers({
  playlist: PlaylistFetchReducer,
  downloads: DownloadsListReducer,
});

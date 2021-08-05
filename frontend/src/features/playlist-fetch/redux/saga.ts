import { put, takeLatest } from 'redux-saga/effects';
import {
  fetchVideos as fetchVideosAction,
  fetchVideosCompleted,
} from './slice';

type fetchVideosActionType = ReturnType<typeof fetchVideosAction>;

function* fetchVideos(action: fetchVideosActionType) {
  const { id: playlistId, isAudio: downloadingAudio } = action.payload;

  const response: Response = yield fetch(
    `https://richee.me/playlist/?list=${playlistId}`
  );
  const videos: Video[] = yield response.json();

  yield put(fetchVideosCompleted({ videos, downloadingAudio }));
}

function* fetchPlaylistSaga() {
  yield takeLatest<fetchVideosActionType>(fetchVideosAction.type, fetchVideos);
}

export default fetchPlaylistSaga;

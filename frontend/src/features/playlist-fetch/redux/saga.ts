import { put, takeLatest } from 'redux-saga/effects';
import MessageType from 'types/browser-message-types';
import getBrowser from 'utils/get-browser';
import {
  fetchVideos as fetchVideosAction,
  fetchVideosCompleted,
} from './slice';

type fetchVideosActionType = ReturnType<typeof fetchVideosAction>;

function* fetchVideos(action: fetchVideosActionType) {
  const { id: playlistId, downloadAudio } = action.payload;

  const response: Response = yield fetch(
    `https://richee.me/playlist/?list=${playlistId}`
  );

  const videos: Video[] = yield response.json();

  yield getBrowser.sendMessage({
    type: MessageType.updateTitle,
    video: videos,
  });
  
  yield put(fetchVideosCompleted({ videos, downloadAudio }));
}

function* fetchPlaylistSaga() {
  yield takeLatest<fetchVideosActionType>(fetchVideosAction, fetchVideos);
}

export default fetchPlaylistSaga;

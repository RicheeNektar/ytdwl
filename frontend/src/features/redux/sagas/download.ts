import { put, takeLatest, select, fork } from '@redux-saga/core/effects';
import { call, delay, take } from 'redux-saga/effects';
import {
  videosSelector,
  downloadAudioSelector,
} from 'features/playlist-fetch/redux/selectors';
import {
  fetchVideosCompleted,
  completedDownloads,
  removeFirstVideo,
  setCurrentId,
} from 'features/playlist-fetch/redux/slice';
import { setVideoId, videoLoaded } from 'features/video-player/redux/slice';
import MessageType from 'types/browser-message-types';
import browser from 'utils/get-browser';
import getVideoUrl from 'utils/get-video-url';
import { RootState } from '../store';

function* startDownload(isRetry = false) {
  const downloadAudio: boolean = yield select(downloadAudioSelector);
  const videos: Video[] = yield select(videosSelector);

  if (videos) {
    const video = videos[0];

    if (video) {
      console.log(`Starting download: ${video.id}`);

      yield put(setVideoId(video.id));
      yield put(setCurrentId(video.id));

      const hasLoaded: boolean = yield select(
        (state: RootState) => state.videoPlayer.loaded
      );

      if (!hasLoaded) {
        console.log('Waiting for iframe');
        yield take(videoLoaded);
        yield delay(1000);
      }

      const response: DownloadResponse | null =
        yield browser.sendMessage<DownloadResponse>({
          type: MessageType.startDownload,
          isAudio: downloadAudio,
          id: video.id,
        });

      if (response?.isRejected) {
        if (response.message === 'no_video_info' && !isRetry) {
          yield call(getVideoInfo, video.id);
        } else {
          console.error(`Download errorred with: ${response.message}`);
          yield call(startNextDownload);
        }
      } else {
        yield call(startNextDownload);
      }
    } else {
      yield put(completedDownloads());
    }
  }
}

function* getVideoInfo(videoId: string): Generator<any> {
  yield browser.updateOrCreateTab(getVideoUrl(videoId));
  yield browser.sendMessage({ type: MessageType.awaitVideoInfo, id: videoId });
  yield call(startDownload, true);
}

function* startNextDownload(): any {
  yield delay(200);
  yield put(removeFirstVideo());
  yield call(startDownload);
}

function* startDownloadFork() {
  yield fork(startDownload);
}

function* cleanupDownloads() {
  yield put(setVideoId(undefined));
  yield put(setCurrentId(undefined));
}

function* DownloadSaga() {
  yield takeLatest(fetchVideosCompleted, startDownloadFork);
  yield takeLatest(completedDownloads, cleanupDownloads);
}

export default DownloadSaga;

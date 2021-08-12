import { put, takeLatest } from 'redux-saga/effects';
import MessageType from 'types/browser-message-types';
import Browser from 'utils/get-browser';
import {
  fetchDownloads as fetchDownloadsAction,
  fetchDownloadsComplete,
} from './slice';

function* fetchDownloads(): any {
  const response: YTDwl.Download[] = yield Browser.sendMessage<
    YTDwl.Download[]
  >({
    type: MessageType.getActiveDownloads,
  });

  yield put(fetchDownloadsComplete(response));
}

function* DownloadsList() {
  yield takeLatest(fetchDownloadsAction, fetchDownloads);
}

export default DownloadsList;

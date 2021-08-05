import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
  downloads?: Download[];
  isFetching: boolean;
};

const initialState: initialStateType = {
  downloads: undefined,
  isFetching: false,
};

const DownloadListSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    fetchDownloads: _state => {},
    fetchDownloadsComplete: (state, action: PayloadAction<Download[]>) => ({
      ...state,
      downloads: action.payload,
      isFetching: false,
    }),
    removeFirstDownload: state => ({
      ...state,
      downloads: state.downloads?.slice(1),
    }),
  },
});

export const { fetchDownloads, fetchDownloadsComplete, removeFirstDownload } =
  DownloadListSlice.actions;

export default DownloadListSlice.reducer;

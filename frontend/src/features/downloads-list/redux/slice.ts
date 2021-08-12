import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
  downloads?: YTDwl.Download[];
  isFetching: boolean;
  current?: number;
};

const initialState: initialStateType = {
  downloads: undefined,
  isFetching: false,
  current: undefined,
};

const DownloadListSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    fetchDownloads: _state => {},
    fetchDownloadsComplete: (
      state,
      action: PayloadAction<YTDwl.Download[]>
    ) => ({
      ...state,
      downloads: action.payload,
      isFetching: false,
    }),
  },
});

export const { fetchDownloads, fetchDownloadsComplete } =
  DownloadListSlice.actions;

export default DownloadListSlice.reducer;

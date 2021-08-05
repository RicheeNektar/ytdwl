import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface stateProps {
  downloadingAudio: boolean;
  isFetching: boolean;
  videos?: Video[];
}

const initialState: stateProps = {
  downloadingAudio: true,
  isFetching: false,
  videos: undefined,
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    fetchVideos: (
      state: stateProps,
      _action: PayloadAction<{ id: string; isAudio: boolean }>
    ) => ({
      ...state,
      isFetching: true,
    }),
    fetchVideosCompleted: (
      state: stateProps,
      {
        payload: { videos, downloadingAudio },
      }: PayloadAction<{ videos: Video[]; downloadingAudio: boolean }>
    ) => ({
      ...state,
      isFetching: false,
      downloadingAudio,
      videos,
    }),
  },
});

export const { fetchVideos, fetchVideosCompleted } = playlistSlice.actions;
export default playlistSlice.reducer;

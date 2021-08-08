import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface stateProps {
  currentId?: string;
  downloadAudio: boolean;
  isDownloading: boolean;
  isFetching: boolean;
  videos?: Video[];
}

const initialState: stateProps = {
  currentId: undefined,
  downloadAudio: true,
  isDownloading: false,
  isFetching: false,
  videos: undefined,
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    fetchVideos: (
      state,
      _action: PayloadAction<{ id: string; downloadAudio: boolean }>
    ) => ({
      ...state,
      isFetching: true,
    }),

    fetchVideosCompleted: (
      state,
      {
        payload: { videos, downloadAudio },
      }: PayloadAction<{ videos: Video[]; downloadAudio: boolean }>
    ) => ({
      ...state,
      isFetching: false,
      isDownloading: true,
      downloadAudio,
      videos,
    }),

    removeFirstVideo: state => ({
      ...state,
      videos: state.videos?.slice(1),
    }),

    setCurrentId: (
      state,
      { payload: currentId }: PayloadAction<string | undefined>
    ) => ({
      ...state,
      currentId,
    }),

    completedDownloads: state => ({
      ...state,
      isDownloading: false,
    }),
  },
});

export const {
  fetchVideos,
  fetchVideosCompleted,
  removeFirstVideo,
  completedDownloads,
  setCurrentId,
} = playlistSlice.actions;
export default playlistSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface stateProps {
  videoId?: string;
  loaded: boolean;
}

const initialState: stateProps = {
  videoId: undefined,
  loaded: false,
};

const VideoPlayerSlice = createSlice({
  name: 'videoPlayer',
  initialState,
  reducers: {
    setVideoId: (
      state: stateProps,
      { payload }: PayloadAction<string | undefined>
    ) =>
      state.videoId === payload
        ? state
        : {
            ...state,
            videoId: payload,
            loaded: false,
          },
    videoLoaded: state => ({
      ...state,
      loaded: true,
    }),
  },
});

export const { setVideoId, videoLoaded } = VideoPlayerSlice.actions;
export default VideoPlayerSlice.reducer;

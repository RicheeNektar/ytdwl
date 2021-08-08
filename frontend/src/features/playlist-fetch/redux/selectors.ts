import { RootState } from 'features/redux/store';

export const videosSelector = (state: RootState) => state.playlist.videos;

export const downloadAudioSelector = (state: RootState) =>
  state.playlist.downloadAudio;

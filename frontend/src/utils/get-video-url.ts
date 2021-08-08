const url = (path: string) => `https://www.youtube.com/${path}`;

const getVideoUrl = (videoId: string, isEmbed = false) =>
  isEmbed
    ? url(`embed/${videoId}?autoplay=1&muted=1`)
    : url(`watch?v=${videoId}`);

export default getVideoUrl;

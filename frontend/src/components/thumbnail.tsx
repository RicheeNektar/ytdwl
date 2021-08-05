import styled from 'styled-components';

const StyledPicture = styled.picture`
  max-height: 64px;
`;

const StyledImg = styled.img`
  border-radius: 10px;
  max-height: inherit;
  height: 100%;
  width: auto;
  aspect-ratio: 16/9;
`;

type Props = {
  videoId: string;
  className?: string;
};

const Thumbnail = ({ className, videoId }: Props) => {
  const src = (size: string) => `https://i.ytimg.com/vi/${videoId}/${size}.jpg`;

  const renderSource = (size: string) => (
    <source key={size} srcSet={src(size)} />
  );

  return (
    <StyledPicture className={className}>
      {['default', 'hqdefault'].map(renderSource)}
      <StyledImg
        key="maxresdefault"
        srcSet={src('maxresdefault')}
        loading="lazy"
      />
    </StyledPicture>
  );
};

export default Thumbnail;

import TestRenderer from 'react-test-renderer';
import { Video as VideoComponent } from 'components';
import { ComponentProps } from 'react';

const video = {
  id: 'test-id',
  title: 'Lorem Ipsum LIVE 2021',
};

type Props = Omit<ComponentProps<typeof VideoComponent>, 'video'>;

const createComponent = (props?: Props) =>
  TestRenderer.create(<VideoComponent video={video} {...props} />);

const standardTest = (props?: Props) => {
  const component = createComponent(props);
  const title = component.root.findAllByType('span')[0];

  expect(title.children.some(e => e === video.title)).toBeTruthy();
  expect(
    component.root.findAll(e => e.props?.srcSet?.includes(video.id)).length
  ).toBe(4);

  return component;
};

describe('Video', () => {
  it('renders without error', () => {
    const component = standardTest();
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders with switch to tab', () => {
    const component = standardTest({ tabId: 1 });

    expect(
      component.root.findAllByType('div')[0].props.title
    ).not.toBeUndefined();

    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders with progress bar', () => {
    const component = standardTest({
      showProgress: true,
      progressTotal: 2,
      progress: 1,
    });

    expect(component.root.findAllByType('div')[0].children.length).toBe(2);

    expect(component.toJSON()).toMatchSnapshot();
  });
});

import TestRenderer from 'react-test-renderer';
import Loading from '..';

const content = 'Lorem Ipsum Text';

describe('Loading', () => {
  it('renders content', () => {
    const component = TestRenderer.create(
      <Loading>
        <p>{content}</p>
      </Loading>
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders loading circle', () => {
    const component = TestRenderer.create(
      <Loading isLoading>
        <p>{content}</p>
      </Loading>
    );

    expect(component.toJSON()).toMatchSnapshot();
  });
});

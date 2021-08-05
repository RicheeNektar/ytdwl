import TestRenderer from 'react-test-renderer';
import { Thumbnail } from 'components';

describe('Thumbnail', () => {
  it('renders without error', () => {
    const testId = 'YifwKK4tFAs';
    const component = TestRenderer.create(<Thumbnail videoId={testId} />);

    const sources = component.root.findAll(e => e.type === 'source');
    expect(sources.length).toBe(2);
    expect(sources.every(e => e.props.srcSet.includes(testId))).toBeTruthy();

    const imgComponent = component.root.find(e => e.type === 'img');
    expect(imgComponent).not.toBeNull();
    expect(imgComponent.props.srcSet.includes(testId)).toBeTruthy();
  });
});

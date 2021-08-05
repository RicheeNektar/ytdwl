import TestRenderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';
import theme from 'theme';
import { ProgressBar } from 'components';

const createComponent = (isAudio: boolean, max?: number) =>
  TestRenderer.create(
    <ThemeProvider theme={theme}>
      <ProgressBar isAudio={isAudio} total={max ?? 2} progress={1} />
    </ThemeProvider>
  );

describe('ProgressBar', () => {
  it('renders audio progress bar', () => {
    const component = createComponent(false);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders video progress bar', () => {
    const component = createComponent(true);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders different width', () => {
    const component = createComponent(true, 5);
    expect(component.toJSON()).toMatchSnapshot();
  });
});

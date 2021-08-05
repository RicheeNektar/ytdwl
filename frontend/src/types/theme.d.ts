import 'styled-components';
import theme from 'theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    video: string;
    audio: string;

    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    white: string;
  }
}

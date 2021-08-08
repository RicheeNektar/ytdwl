import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import 'utils/get-browser';
import MessageListener from 'features/message-listener';
import store from 'features/redux/store';
import Header from 'features/header';
import Home from 'scenes/main';
import theme from './theme';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MessageListener store={store} />
        <Header />
        <Home />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

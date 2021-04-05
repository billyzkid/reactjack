import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import ContextProvider from './components/ContextProvider.jsx';
import App from './components/App.jsx';
import { preloadImages, preloadSounds } from './utils.js';
import '../styles/index.scss';

preloadImages();
preloadSounds();

render(
  <StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </StrictMode>,
  document.getElementById('root')
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}

import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './components/App.jsx';
import '../styles/index.scss';

render(
  <StrictMode>
    <App prop2="baz" />
  </StrictMode>,
  document.getElementById('root')
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}

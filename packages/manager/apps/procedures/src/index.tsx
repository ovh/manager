import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './global.css';
import './index.scss';

try {
  await import(`./config-${region}.js`);
} catch (error) {
  // nothing to
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

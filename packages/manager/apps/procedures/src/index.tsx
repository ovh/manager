import React from 'react';

import ReactDOM from 'react-dom/client';

import { HOSTNAME_REGIONS } from '@ovh-ux/manager-config';

import App from './App';
import './global.css';
import './index.scss';

const region = HOSTNAME_REGIONS[window.location.hostname] || 'EU';

import(`./config-${region}.js`)
  .catch(() => {})
  .then(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  });

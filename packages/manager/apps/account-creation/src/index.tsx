import React from 'react';
import ReactDOM from 'react-dom/client';
import { odsSetup } from '@ovhcloud/ods-common-core';
import {
  HOSTNAME_REGIONS,
  useDefaultLanguage,
  findAvailableLocale,
  detectUserLocale,
} from '@ovh-ux/manager-config';
import '@ovh-ux/manager-react-components/dist/style.css';
import initI18n from './i18n';
import App from './App';
import './vite-hmr';
import './index.scss';

const region = HOSTNAME_REGIONS[window.location.hostname] || 'EU';

import(`./config-${region}.js`)
  .catch(() => {})
  .then(() => {
    useDefaultLanguage('en_GB');
    const locale = findAvailableLocale(detectUserLocale());

    initI18n(locale);
    odsSetup();

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  });

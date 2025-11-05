import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  useDefaultLanguage,
  findAvailableLocale,
  detectUserLocale,
} from '@ovh-ux/manager-config';
import '@ovh-ux/manager-react-components/dist/style.css';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';
import '@ovh-ux/manager-gcj-module/dist/style.css';
import initI18n from './i18n';
import App from './App';
import './vite-hmr';
import './index.scss';
import TrackingProvider from './context/tracking/tracking.provider';
import { getRegion } from '@/helpers/region/regionHelper';

const region = getRegion();

if (__VERSION__) {
  defineApplicationVersion(__VERSION__);
}

import(`./config-${region}.js`)
  .catch(() => {})
  .then(async () => {
    useDefaultLanguage('en_GB');
    const locale = findAvailableLocale(detectUserLocale());

    await initI18n(locale);

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <TrackingProvider region={region}>
          <App />
        </TrackingProvider>
      </React.StrictMode>,
    );
  });

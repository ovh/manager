import React from 'react';

import './helpers/piano-override';
import 'piano-analytics-js/dist/browser/piano-analytics.js';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import { initShell } from '@ovh-ux/shell';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { detectUserLocale, findAvailableLocale, HOSTNAME_REGIONS, Region } from '@ovh-ux/manager-config';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';

import Container from '@/container';
import { ApplicationProvider } from '@/context';
import { initSso } from '@/core/sso';
import { setupDevApplication } from '@/core/dev';
import { ContainerProvider } from '@/core/container';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'react-tooltip/dist/react-tooltip.css';
import './index.scss';
import './global.scss';
// avoid container inception
if (window.top !== window.self) {
  window.top.location.href = window.self.location.href;
}

__VERSION__ && defineApplicationVersion(__VERSION__);

const region = HOSTNAME_REGIONS[window.location.hostname] || 'EU';

initSso();

const config = () => import(`./config-${region}.js`);

config()
  .catch(() => {})
  .then(() => {
    i18n
      .use(initReactI18next)
      .use(Backend)
      .use({
        type: 'postProcessor',
        name: 'normalize',
        process: function process(value: string, key: string) {
          if (!value) {
            return value;
          }
          return value.replace(/&amp;/g, '&');
        },
      })
      .init({
        lng: findAvailableLocale(detectUserLocale(), region as Region),
        fallbackLng: 'fr_FR',
        ns: [], // namespaces to load by default
        load: 'currentOnly',
        backend: {
          // path construction for async load, ns: namespace, lng: locale
          loadPath: (lngs: string[], namespaces: string[]) => {
            return `./translations/${namespaces[0]}/Messages_${lngs[0]}.json`;
          },
        },
        postProcess: 'normalize',
      });

    const root = createRoot(document.querySelector('#app'));
    const queryClient = new QueryClient();

    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <ApplicationProvider>
            <ContainerProvider>
              <HashRouter>
                <Container />
              </HashRouter>
            </ContainerProvider>
          </ApplicationProvider>
        </QueryClientProvider>
      </React.StrictMode>,
    );
  });

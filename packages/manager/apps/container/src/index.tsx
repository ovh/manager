import React from 'react';

import './helpers/piano-override';
import 'piano-analytics-js/dist/browser/piano-analytics.js';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';
import { initSso } from '@/core/sso';

import App from './App';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'react-tooltip/dist/react-tooltip.css';
import './index.scss';
import './global.scss';
// avoid container inception
if (window.top !== window.self) {
  window.top.location.href = window.self.location.href;
}

if (__VERSION__) {
  defineApplicationVersion(__VERSION__);
}

initSso();

const queryClient = new QueryClient();

const root = createRoot(document.querySelector('#app'));

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);

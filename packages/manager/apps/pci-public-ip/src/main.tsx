import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellProvider,
  initShellContext,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { ManagerReactComponentsProvider } from '@ovh-ux/manager-react-components';
import {
  apiClient,
  fetchIcebergV6,
  fetchIcebergV2,
} from '@ovh-ux/manager-core-api';
import App from './App';
import initI18n from './i18n';

import './index.css';

import '@/vite-hmr.ts';

const init = async (
  appName: string,
  { reloadOnLocaleChange } = { reloadOnLocaleChange: false },
) => {
  const context = await initShellContext(appName);

  const region = context.environment.getRegion();
  try {
    await import(`./config-${region}.js`);
  } catch (error) {
    // nothing to do
  }

  const locales = await context.shell.i18n.getAvailableLocales();

  const i18n = await initI18n(
    context.environment.getUserLocale(),
    locales.map(({ key }) => key),
  );

  context.shell.i18n.onLocaleChange(({ locale }: { locale: string }) => {
    if (reloadOnLocaleChange) {
      window.top?.location.reload();
    } else {
      i18n.changeLanguage(locale);
    }
  });

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ShellProvider client={context}>
        <ManagerReactComponentsProvider
          shellContext={ShellContext}
          apiClient={apiClient}
          iceberg={{ fetchIcebergV2, fetchIcebergV6 }}
        >
          <App />
        </ManagerReactComponentsProvider>
      </ShellProvider>
    </React.StrictMode>,
  );
};

init('pci-public-ip');

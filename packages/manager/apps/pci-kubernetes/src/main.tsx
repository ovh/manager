import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  initI18n,
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
    // nothing to
  }

  await initI18n({
    context,
    reloadOnLocaleChange,
    ns: ['common'],
    defaultNS: 'common',
  });

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <ManagerReactComponentsProvider
          shellContext={ShellContext}
          apiClient={apiClient}
          iceberg={{ fetchIcebergV2, fetchIcebergV6 }}
        >
          <App />
        </ManagerReactComponentsProvider>
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

init('pci-kubernetes');

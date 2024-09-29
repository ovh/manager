import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellContext,
  initShellContext,
  initI18n,
} from '@ovh-ux/manager-react-shell-client';
import { ManagerReactComponentsProvider } from '@ovh-ux/manager-react-components';
import {
  apiClient,
  fetchIcebergV2,
  fetchIcebergV6,
} from '@ovh-ux/manager-core-api';
import App from './App';
import './global.css';
import '@/vite-hmr';

const init = async (appName: string) => {
  const context = await initShellContext(appName);
  const region = context.environment.getRegion();

  try {
    await import(`./config-${region}.js`);
  } catch (error) {
    // nothing to do
  }

  initI18n({
    context,
    ns: ['catalog/filters', 'catalog/search', 'catalog/error'],
    defaultNS: 'catalog',
    reloadOnLocaleChange: true,
  });

  const root = ReactDOM.createRoot(document.getElementById('root'));

  root.render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <ManagerReactComponentsProvider
          shellContext={ShellContext}
          apiClient={apiClient}
          iceberg={{
            fetchIcebergV2,
            fetchIcebergV6,
          }}
        >
          <App />
        </ManagerReactComponentsProvider>
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

init('catalog');

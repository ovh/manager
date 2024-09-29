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
  fetchIcebergV6,
  fetchIcebergV2,
} from '@ovh-ux/manager-core-api';
import App from './App';

import './global.css';
import '@ovhcloud/ods-theme-blue-jeans';

const init = async (appName: string) => {
  const context = await initShellContext(appName);

  const region = context.environment.getRegion();
  try {
    await import(`./config-${region}.js`);
  } catch (error) {
    // nothing to do
  }

  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: appName,
    ns: [`${appName}/listing`, `${appName}/dashboard`, `${appName}/terminate`],
  });

  ReactDOM.createRoot(document.getElementById('root')!).render(
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

init('key-management-service');

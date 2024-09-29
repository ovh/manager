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
import { setupMocks } from '../mocks/setup';
import { App } from './App';
import '@ovhcloud/ods-theme-blue-jeans/dist/index.css';
import './index.css';
import './vite-hmr';
import { getTrackingContext } from './utils/tracking';

const init = async ({
  appName,
  mockNetwork,
}: {
  appName: string;
  mockNetwork?: boolean;
}) => {
  if (mockNetwork) {
    await setupMocks();
  }

  const context = await initShellContext(appName, getTrackingContext(appName));
  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: appName,
    ns: [appName, `${appName}/listing`, `${appName}/error`],
  });

  const rootElement = document.getElementById('ovh-app');
  const root = ReactDOM.createRoot(rootElement);

  root.render(
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

init({
  appName: 'vrack-services',
  mockNetwork:
    window.location.href.includes('localhost:9001') &&
    !import.meta.env.VITE_TEST_BDD,
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellContext,
  initShellContext,
  initI18n,
} from '@ovh-ux/manager-react-shell-client';
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
    ns: [appName, `${appName}/listing`],
  });

  const rootElement = document.getElementById('ovh-app');
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
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

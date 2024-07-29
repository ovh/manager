import {
  ShellContext,
  initI18n,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';
import '@ovhcloud/ods-theme-blue-jeans/dist/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import './vite-hmr';

import { APP_NAME, LEVEL2, SUB_UNIVERSE, UNIVERSE } from './tracking.constant';

const trackingContext = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: APP_NAME,
  appName: APP_NAME,
  pageTheme: UNIVERSE,
  level2Config: LEVEL2,
};

const init = async (appName: string) => {
  const context = await initShellContext(appName, trackingContext);

  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: appName,
    ns: ['listing', 'renew', 'onboarding', 'create'],
  });

  const region = context.environment.getRegion();
  context.shell.tracking.setConfig(region, LEVEL2);
  try {
    await import(`./config-${region}.js`);
  } catch (error) {
    // nothing to do
  }

  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ShellContext.Provider value={context}>
          <App />
        </ShellContext.Provider>
      </React.StrictMode>,
    );
  }
};

init('pci-savings-plan');

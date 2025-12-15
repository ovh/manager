import React from 'react';

import ReactDOM from 'react-dom/client';

import '@ovh-ux/manager-react-components/dist/style.css';
import { ShellContext, initI18n, initShellContext } from '@ovh-ux/manager-react-shell-client';

import App from './App';
import './App.scss';
import { APP_NAME, LEVEL2, SUB_UNIVERSE, UNIVERSE } from './tracking.constant';
import { initModuleFederation } from './utils/module-federation-runtime';
import './vite-hmr';

const trackingContext = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: APP_NAME,
  appName: APP_NAME,
  pageTheme: UNIVERSE,
  level2Config: LEVEL2,
};

const init = async (appName: string) => {
  initModuleFederation();

  const context = await initShellContext(appName, trackingContext);

  await initI18n({
    context,
    reloadOnLocaleChange: false,
    defaultNS: appName,
    ns: ['listing', 'home', 'onboarding'],
  });

  const region = context.environment.getRegion();
  context.shell.tracking.setConfig(region, LEVEL2);
  try {
    await import(`./config-${region}.js`);
  } catch {
    // nothing to do
  }

  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element not found');

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

void init('pci-project');

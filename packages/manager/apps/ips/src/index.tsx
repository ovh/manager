import React from 'react';

import ReactDOM from 'react-dom/client';

import {
  ShellContext,
  ShellContextType,
  initI18n,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';

import App from './App';
import './index.scss';
import { LEVEL2, SUB_UNIVERSE, UNIVERSE } from './tracking.constant';
import './vite-hmr';

const trackingContext = {
  chapter1: UNIVERSE.toLowerCase(),
  chapter2: SUB_UNIVERSE,
  chapter3: 'ip',
  appName: 'ip',
  pageTheme: UNIVERSE,
  level2Config: LEVEL2,
};

const init = async (appName: string) => {
  const context = (await initShellContext(
    appName,
    trackingContext,
  )) as ShellContextType;

  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: appName,
    ns: ['listing', 'order', 'onboarding', 'error'],
  });

  const region = context.environment.getRegion();
  context.shell.tracking.setConfig(region, LEVEL2);
  try {
    await import(`./config-${region}.js`);
  } catch {
    // nothing to do
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

init('ips');

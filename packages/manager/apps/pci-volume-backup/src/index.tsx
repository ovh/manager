import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellContext,
  initShellContext,
  initI18n,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import '@ovh-ux/manager-react-components/dist/style.css';
import App from './App';
import './vite-hmr';
import './index.scss';

import { UNIVERSE, SUB_UNIVERSE, APP_NAME, LEVEL2 } from './tracking.constant';

const trackingContext = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: APP_NAME,
  appName: APP_NAME,
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
    reloadOnLocaleChange: false,
    defaultNS: appName,
    ns: ['listing', 'dashboard', 'onboarding'],
  });

  const region = context.environment?.getRegion();
  if(region) {
    context?.shell?.tracking.setConfig(region, LEVEL2);
  }

  try {
    await import(`./config-${region}.js`);
  } catch (error) {
    // nothing to do
  }

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

init('pci-volume-backup');

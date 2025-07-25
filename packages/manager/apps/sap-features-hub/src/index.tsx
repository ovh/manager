import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellContext,
  initShellContext,
  initI18n,
} from '@ovh-ux/manager-react-shell-client';
import '@ovh-ux/manager-react-components/dist/style.css';
import App from './App';
import './vite-hmr';
import './index.scss';

import { UNIVERSE, APP_NAME, LEVEL2 } from './tracking.constants';

const trackingContext = {
  chapter1: UNIVERSE,
  chapter2: APP_NAME,
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
    ns: ['listing', 'dashboard', 'onboarding'],
  });

  const region = context.environment.getRegion();
  context.shell.tracking.setConfig(region, LEVEL2);
  try {
    await import(`./config-${region}.js`);
  } catch (error) {
    // nothing to do
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

init('sap-features-hub');

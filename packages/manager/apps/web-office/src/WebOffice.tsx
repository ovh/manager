import React from 'react';

import ReactDOM from 'react-dom/client';

import { ShellContext, initI18n, initShellContext } from '@ovh-ux/manager-react-shell-client';

import App from './App';
import { APP_NAME, LEVEL2, SUB_UNIVERSE, UNIVERSE } from './Tracking.constants';
import './index.scss';
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
  const context = await initShellContext(appName, trackingContext);

  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: appName,
    ns: ['common', 'licenses', 'dashboard', 'onboarding'],
  });

  const region = context.environment.getRegion();
  context.shell.tracking.setConfig(region, LEVEL2);

  try {
    await import(`./config-${region}.js`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
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

void init('web-office');

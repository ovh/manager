import React from 'react';

import 'element-internals-polyfill';
import ReactDOM from 'react-dom/client';

import { ShellContext, initI18n, initShellContext } from '@ovh-ux/manager-react-shell-client';

import App from './App';
import './index.scss';
import { APP_NAME, LEVEL2, SUB_UNIVERSE, UNIVERSE } from './tracking.constants';
import './vite-hmr';

const trackingContext = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: APP_NAME,
  appName: APP_NAME,
  level2Config: LEVEL2,
  pageTheme: UNIVERSE,
};

const init = async (appName: string) => {
  const context = await initShellContext(appName, trackingContext);

  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: 'common',
    ns: ['dashboard', 'common'],
  });

  const region = context.environment.getRegion();
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

init('zimbra');

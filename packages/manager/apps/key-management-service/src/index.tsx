import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellContext,
  initShellContext,
  initI18n,
} from '@ovh-ux/manager-react-shell-client';
import App from './App';

import './global.css';
import '@ovhcloud/ods-theme-blue-jeans';

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
  const context = await initShellContext(appName, trackingContext);

  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: appName,
    ns: [`${appName}/listing`, `${appName}/dashboard`, `${appName}/terminate`],
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

init('key-management-service');

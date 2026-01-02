import React from 'react';

import ReactDOM from 'react-dom/client';

import { ShellContext, initI18n, initShellContext } from '@ovh-ux/manager-react-shell-client';

import App from './App';
import { APP_NAME } from './App.constants';
import './index.scss';
import { LEVEL2, TRACKING_CONTEXT } from './tracking.constant';

const init = async (appName: string) => {
  const context = await initShellContext(appName, TRACKING_CONTEXT);

  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: `${appName}/listing`,
    ns: [`${appName}/listing`, `${appName}/dashboard`, `${appName}/terminate`],
  });

  const region = context.environment.getRegion();
  context.shell.tracking.setConfig(region, LEVEL2);

  try {
    await import(`./config-${region}.js`);
  } catch {
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

void init(APP_NAME);

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellContext,
  initShellContext,
  initI18n,
} from '@ovh-ux/manager-react-shell-client';
import App from './App';
import './index.scss';
import './vite-hmr';
import { APP_NAME, LEVEL2, TRACKING_CONTEXT } from './tracking.constant';

const init = async (appName: string) => {
  const context = await initShellContext(appName, TRACKING_CONTEXT);

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

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

init(APP_NAME);

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellProvider,
  initShellContext,
  initI18n,
} from '@ovh-ux/manager-react-shell-client';
import App from './App';

import './global.css';
import '@ovhcloud/ods-theme-blue-jeans';

const init = async (appName: string) => {
  const context = await initShellContext(appName);

  const region = context.environment.getRegion();
  try {
    await import(`./config-${region}.js`);
  } catch (error) {
    // nothing to do
  }

  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: appName,
    ns: [appName, `${appName}/listing`],
  });

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ShellProvider client={context}>
        <App />
      </ShellProvider>
    </React.StrictMode>,
  );
};

init('key-management-service');

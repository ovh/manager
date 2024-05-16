import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellContext,
  initShellContext,
  initI18n,
} from '@ovh-ux/manager-react-shell-client';
import App from './App';
import '@ovhcloud/ods-theme-blue-jeans/dist/index.css';
import './global.css';
import './vite-hmr';

const init = async (appName: string) => {
  const context = await initShellContext(appName);

  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: appName,
    ns: [`${appName}/listing`, `${appName}/dashboard`, `${appName}/onboarding`],
  });

  const region = context.environment.getRegion();
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

init('pci-file-storage');

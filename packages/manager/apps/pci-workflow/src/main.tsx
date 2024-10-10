import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  initI18n,
  initShellContext,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import App from './App';

import './index.css';

import '@/vite-hmr.ts';

const init = async (
  appName: string,
  { reloadOnLocaleChange } = { reloadOnLocaleChange: false },
) => {
  const context = await initShellContext(appName);

  const region = context.environment.getRegion();
  try {
    await import(`./config-${region}.js`);
  } catch (error) {
    // nothing to do
  }

  await initI18n({
    context,
    reloadOnLocaleChange,
    ns: ['pci-common'],
    defaultNS: 'pci-common',
  });

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

init('pci-workflow');

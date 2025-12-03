import React from 'react';

import ReactDOM from 'react-dom/client';

import '@ovh-ux/manager-pci-common/dist/style.css';
import { ShellContext, initI18n, initShellContext } from '@ovh-ux/manager-react-shell-client';

import '@/vite-hmr';

import App from './App';
import './index.scss';

const init = async (
  appName: string,
  { reloadOnLocaleChange } = { reloadOnLocaleChange: false },
) => {
  const context = await initShellContext(appName);

  const region = context.environment.getRegion();
  try {
    await import(`./config-${region}.js`);
  } catch (_error) {
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

void init('pci-workflow');

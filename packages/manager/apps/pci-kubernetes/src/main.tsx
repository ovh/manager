import React from 'react';

import ReactDOM from 'react-dom/client';

import '@ovh-ux/manager-pci-common/dist/style.css';
import { ShellContext, initI18n, initShellContext } from '@ovh-ux/manager-react-shell-client';

import '@/vite-hmr';

import App from './App';
import './index.css';
import { useAppStore } from './store';

const init = async (
  appName: string,
  { reloadOnLocaleChange } = { reloadOnLocaleChange: false },
) => {
  const context = await initShellContext(appName);

  const region = context.environment.getRegion();
  useAppStore.getState().setRegion(region);

  try {
    await import(`./config-${region}.js`);
  } catch (error) {
    // nothing to
  }

  await initI18n({
    context,
    reloadOnLocaleChange,
    ns: ['common'],
    defaultNS: 'common',
  });

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

init('pci-kubernetes');

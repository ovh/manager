import React from 'react';

import ReactDOM from 'react-dom/client';

import { ShellContext, initI18n, initShellContext } from '@ovh-ux/manager-react-shell-client';

import '@/vite-hmr';

import App from './App';
import './global.css';

const init = async (appName: string) => {
  const context = await initShellContext(appName);
  const region = context.environment.getRegion();

  try {
    await import(`./config-${region}.js`);
  } catch (error) {
    // nothing to do
  }

  initI18n({
    context,
    ns: ['catalog/filters', 'catalog/search', 'catalog/error'],
    defaultNS: 'catalog',
    reloadOnLocaleChange: true,
  });

  const root = ReactDOM.createRoot(document.getElementById('root'));

  root.render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

init('catalog');

// Test Comment to verify new deploy model on 13/03

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellContext,
  initShellContext,
  initI18n,
} from '@ovh-ux/manager-react-shell-client';
import App from './App';
import './global.css';
import '@/vite-hmr';

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

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellProvider,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';
import App from './App';
import initI18n from './i18n';

import './global.css';

import '@/vite-hmr';

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

  const locales = await context.shell.i18n.getAvailableLocales();

  const i18n = await initI18n(
    context.environment.getUserLocale(),
    locales.map(({ key }) => key),
  );

  context.shell.i18n.onLocaleChange(({ locale }: { locale: string }) => {
    if (reloadOnLocaleChange) {
      window.top?.location.reload();
    } else {
      i18n.changeLanguage(locale);
    }
  });

  const root = document.getElementById('root');
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ShellProvider client={context}>
        <App />
      </ShellProvider>
    </React.StrictMode>,
  );
};

init('catalog', { reloadOnLocaleChange: true });

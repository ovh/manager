import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellProvider,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';
import initI18n from './i18n';
import App from './App';

import '@/vite-hmr.ts';
import { LoadingIndicatorProvider } from './contexts/LoadingIndicator.context';

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

  const i18n = initI18n(
    context.environment.getUserLocale(),
    locales.map(({ key }: { key: string }) => key),
  );

  context.shell.i18n.onLocaleChange(({ locale }: { locale: string }) => {
    if (reloadOnLocaleChange) {
      window.top?.location.reload();
    } else {
      i18n.changeLanguage(locale);
    }
  });

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ShellProvider client={context}>
        <LoadingIndicatorProvider>
          <App />
        </LoadingIndicatorProvider>
      </ShellProvider>
    </React.StrictMode>,
  );
};

init('pci-ai-dashboard');

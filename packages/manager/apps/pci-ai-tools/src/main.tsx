import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellProvider,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';
import initI18n from './i18n';

import './index.css';
import App from './App';

import '@/vite-hmr.ts';
import { LoadingIndicatorProvider } from './contexts/LoadingIndicator.context';
import {
  UNIVERSE,
  SUB_UNIVERSE,
  APP_NAME,
  LEVEL2,
} from './configuration/tracking.constants';

const trackingContext = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: APP_NAME,
  appName: APP_NAME,
  pageTheme: UNIVERSE,
  level2Config: LEVEL2,
};
const init = async (
  appName: string,
  { reloadOnLocaleChange } = { reloadOnLocaleChange: false },
) => {
  const context = await initShellContext(appName, trackingContext);

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

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <ShellProvider client={context}>
        <LoadingIndicatorProvider>
          <App />
        </LoadingIndicatorProvider>
      </ShellProvider>
    </React.StrictMode>,
  );
};

init('pci-ai-tools');

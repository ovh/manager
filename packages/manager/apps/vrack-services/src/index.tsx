import { setupWorker } from 'msw/browser';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellContext,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { toMswHandlers } from '../../../../../playwright-helpers/msw';
import { getConfig } from '../mock/handlers';
import { App } from './App';
import initI18n from './i18n';
import '@ovhcloud/ods-theme-blue-jeans/dist/index.css';
import './global.css';
import './vite-hmr';

const init = async (
  appName: string,
  { reloadOnLocaleChange } = { reloadOnLocaleChange: false },
) => {
  if (
    window.location.href.includes('localhost:9001') &&
    !import.meta.env.VITE_TEST_BDD
  ) {
    await setupWorker(
      ...toMswHandlers(
        getConfig({
          nbVs: 19,
          delayedOrders: true,
          deliveringVrackServicesOrders: true,
          deliveringVrackOrders: false,
          isAuthMocked: true,
        }),
      ),
    ).start({
      onUnhandledRequest: 'bypass',
    });
  }

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
    locales.map(({ key }: { name: string; key: string }) => key),
  );

  context.shell.i18n.onLocaleChange(({ locale }: { locale: string }) => {
    if (reloadOnLocaleChange) {
      window.top?.location.reload();
    } else {
      i18n.changeLanguage(locale);
    }
  });

  const rootElement = document.getElementById('ovh-app');

  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

init('vrack-services');

import { setupWorker } from 'msw/browser';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellProvider,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { getMswHandlers } from '../mock/handlers';
import { App } from './App';
import initI18n from './i18n';
import '@ovhcloud/ods-theme-blue-jeans/dist/index.css';
import './global.css';
import './vite-hmr.ts';

const init = async (
  appName: string,
  { reloadOnLocaleChange } = { reloadOnLocaleChange: false },
) => {
  if (
    window.location.href.includes('localhost:9001') &&
    !import.meta.env.VITE_TEST_BDD
  ) {
    await setupWorker(
      ...getMswHandlers({
        nbVs: 19,
        deliveringVrackServicesOrders: true,
        deliveringVrackOrders: false,
        isAuthMocked: true,
      }),
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

  const rootElement = document.getElementById('root') as HTMLElement;

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ShellProvider client={context}>
        <App />
      </ShellProvider>
    </React.StrictMode>,
  );
};

init('vrack-services');

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  initI18n,
  initShellContext,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import '@ovhcloud/ods-themes/default';
import '@/vite-hmr';
import App from './App';
import '@ovh-ux/manager-pci-common/dist/style.css';
import './index.scss';
import { APP_NAME, LEVEL2, SUB_UNIVERSE, UNIVERSE } from './tracking.constants';
import { i18n } from 'i18next';

export let i18nInstance: i18n;

const trackingContext = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: APP_NAME,
  appName: APP_NAME,
  level2Config: LEVEL2,
  pageTheme: UNIVERSE,
};

const init = async (
  appName: string,
  { reloadOnLocaleChange } = { reloadOnLocaleChange: false },
) => {
  const context = await initShellContext(appName, trackingContext);

  const region = context.environment.getRegion();
  try {
    await import(`./config-${region}.js`);
  } catch {
    // nothing to do
  }

  i18nInstance = await initI18n({
    context,
    reloadOnLocaleChange,
    ns: [
      'actions',
      'common',
      'creation',
      'dashboard',
      'list',
      'onboarding',
      'order-price',
      'regions',
      'status',
    ],
    defaultNS: 'common',
  });

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

void init('pci-instances');

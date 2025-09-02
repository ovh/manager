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
import './index.scss';
import { APP_NAME, LEVEL2, SUB_UNIVERSE, UNIVERSE } from './tracking.constants';

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

  await initI18n({
    context,
    reloadOnLocaleChange,
    ns: ['common'],
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

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellContext,
  initShellContext,
  initI18n,
} from '@ovh-ux/manager-react-shell-client';
import '@ovhcloud/ods-themes/default';
import App from './App';
import './index.scss';
import { LEVEL2, UNIVERSE, SUB_UNIVERSE, APP_NAME } from './tracking.constant';

const trackingContext = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: APP_NAME,
  appName: APP_NAME,
  level2Config: LEVEL2,
  pageTheme: UNIVERSE,
};

const init = async (): Promise<void> => {
  const context = await initShellContext('vps', trackingContext);

  await initI18n({
    context,
    reloadOnLocaleChange: false,
    ns: ['vps'],
    defaultNS: 'vps',
  });

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
  );

  root.render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

init();

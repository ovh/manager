import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellContext,
  initShellContext,
  initI18n,
} from '@ovh-ux/manager-react-shell-client';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import App from './App';
import '@ovhcloud/ods-theme-blue-jeans/dist/index.css';
import './index.scss';
import './vite-hmr';

import { UNIVERSE, SUB_UNIVERSE, APP_NAME, LEVEL2 } from './tracking.constant';

const trackingContext = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: APP_NAME,
  appName: APP_NAME,
  pageTheme: UNIVERSE,
  level2Config: LEVEL2,
};

const init = async (appName: string) => {
  const context = await initShellContext(appName, trackingContext);

  const isSidebarMenuVisible = await context.shell.ux.isMenuSidebarVisible();
  if (!isTopLevelApplication()) {
    context.shell.ux.startProgress();
  }

  context.shell.ux.setForceAccountSiderBarDisplayOnLargeScreen(true);
  if (!isSidebarMenuVisible) {
    context.shell.ux.showAccountSidebar();
  }

  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: appName,
    ns: [
      `${appName}/support`,
      `${appName}/products`,
      `${appName}/order`,
      `${appName}/billing`,
      `${appName}/error`,
      `${appName}/payment-status`,
      `billing/actions`,
      `billing/status`,
    ],
  });

  const region = context.environment.getRegion();
  context.shell.tracking.setConfig(region, LEVEL2);
  try {
    await import(`./config-${region}.js`);
  } catch (error) {
    // nothing to do
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

init('hub');

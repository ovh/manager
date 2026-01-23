import React from 'react';

import ReactDOM from 'react-dom/client';

import { ShellContext, initI18n, initShellContext } from '@ovh-ux/manager-react-shell-client';
import '@ovh-ux/muk/dist/style.css';

import { App } from './App';
import './style.scss';
import { LEVEL2, TRANSLATION_NAMESPACES } from './utils/constants';
import { getTrackingContext } from './utils/tracking';
import './vite-hmr';

const init = async ({ appName }: { appName: string }) => {
  const context = await initShellContext(appName, getTrackingContext(appName));
  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: appName,
    ns: [TRANSLATION_NAMESPACES.common, TRANSLATION_NAMESPACES.listing],
  });

  const region = context.environment.getRegion();
  context.shell.tracking.setConfig(region, LEVEL2);
  try {
    await import(`./config-${region}.js`);
  } catch (error) {
    console.warn('error while loading js file: ', error);
  }

  const rootElement = document.getElementById('ovh-app');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <ShellContext.Provider value={context}>
          <App />
        </ShellContext.Provider>
      </React.StrictMode>,
    );
  }
};

void init({
  appName: 'vrack-services',
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellContext,
  initShellContext,
  initI18n,
} from '@ovh-ux/manager-react-shell-client';
import { App } from './App';
import './index.scss';
import './vite-hmr';
import { getTrackingContext } from './utils/tracking';
import { TRANSLATION_NAMESPACES } from './utils/constants';

const init = async ({ appName }: { appName: string }) => {
  const context = await initShellContext(appName, getTrackingContext(appName));
  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: appName,
    ns: [TRANSLATION_NAMESPACES.common, TRANSLATION_NAMESPACES.listing],
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

init({
  appName: 'vrack-services',
});

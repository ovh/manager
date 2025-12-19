import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import {
  initI18n,
  initShellContext,
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { TerminalContextProvider } from 'react-terminal';
import appRoutes from '@/routes';

import './index.css';

import '@/vite-hmr';

const router = createHashRouter(appRoutes);
const init = async (
  appName: string,
  { reloadOnLocaleChange } = { reloadOnLocaleChange: false },
) => {
  const context = (await initShellContext(appName)) as ShellContextType;

  const region = context.environment.getRegion();
  try {
    await import(`./config-${region}.js`);
  } catch (error) {
    // nothing to do
  }

  await initI18n({
    context,
    reloadOnLocaleChange,
    ns: ['common'],
    defaultNS: 'common',
  });

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <TerminalContextProvider>
          <RouterProvider router={router}></RouterProvider>
        </TerminalContextProvider>
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

init('cloud-shell');

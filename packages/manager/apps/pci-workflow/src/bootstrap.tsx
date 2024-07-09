import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  initI18n,
  initShellContext,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';

import '@ovhcloud/ods-theme-blue-jeans';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { odsSetup } from '@ovhcloud/ods-common-core';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
    },
  },
});

export const bootstrap = async (
  appName: string,
  children: JSX.Element,
  { reloadOnLocaleChange } = { reloadOnLocaleChange: false },
) => {
  odsSetup();

  const context = await initShellContext(appName);

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
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

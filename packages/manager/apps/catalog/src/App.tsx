import React, { Suspense } from 'react';

import { RouterProvider, createHashRouter, createRoutesFromElements } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { odsSetup } from '@ovhcloud/ods-common-core';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import '@ovhcloud/ods-theme-blue-jeans';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import Routes from '@/routes';

odsSetup();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 300_000,
    },
  },
});

function App() {
  const { shell } = React.useContext(ShellContext);
  const routes = createHashRouter(createRoutesFromElements(Routes));

  React.useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}>
        <RouterProvider router={routes} />
      </Suspense>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;

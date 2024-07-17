import React, { useEffect, useContext } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { routes } from './routes/routes';
import { useFeatureAvailability } from '@ovhcloud/manager-components';

odsSetup();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
    },
  },
});

function Routes() {
  const { shell } = useContext(ShellContext);
  const router = createHashRouter(routes);
  const { data, isLoading, isError } = useFeatureAvailability([
    'dedicated-servers',
  ]);

  useEffect(() => {
    if (!isLoading) {
      shell.ux.hidePreloader();

      if (isError || !data?.['dedicated-servers']) {
        shell.navigation.navigateTo('dedicated', '#/server', {});
      }
    }
  }, [isLoading, isError, data, shell]);

  return isLoading ? <></> : <RouterProvider router={router} />;
}

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <Routes />
    <ReactQueryDevtools />
  </QueryClientProvider>
);

export default App;

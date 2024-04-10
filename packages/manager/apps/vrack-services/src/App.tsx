import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import '@ovhcloud/ods-theme-blue-jeans';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { getRoutes } from '@/router/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000,
    },
  },
});

odsSetup();

export const App: React.FC = () => {
  const { shell } = React.useContext(ShellContext);
  const routes = getRoutes();
  const router = createHashRouter(routes);

  React.useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

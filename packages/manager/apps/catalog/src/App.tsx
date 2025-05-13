import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import appRoutes from './routes';
import '@ovhcloud/ods-theme-blue-jeans';

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
  const router = createHashRouter(appRoutes);

  React.useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;

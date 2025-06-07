import React, { useContext, useEffect } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { routes } from './routes/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
      retry: 2,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;

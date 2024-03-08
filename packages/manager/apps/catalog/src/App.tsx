import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { useShell } from '@ovh-ux/manager-react-shell-client';
import appRoutes from './routes';
import '@ovhcloud/ods-theme-blue-jeans';
import queryClient from './query.client';

odsSetup();
const router = createHashRouter(appRoutes);

const Router = () => <RouterProvider router={router} />;

function App() {
  const shell = useShell();
  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

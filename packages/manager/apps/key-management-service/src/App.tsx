import React, { useEffect, useContext } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import queryClient from './query.client';

import appRoutes from './routes';

odsSetup();
const router = createHashRouter(appRoutes);

function App() {
  const shellContext = useContext(ShellContext);
  useEffect(() => {
    shellContext.shell.ux.hidePreloader();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

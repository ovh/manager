import React, { Suspense, useContext, useEffect } from 'react';

import { RouterProvider, createHashRouter, createRoutesFromElements } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import FullPageSpinner from './components/FullPageSpinner';
import queryClient from './queryClient';
import Routes from './routes/routes';

function App() {
  const { shell } = useContext(ShellContext);
  const router = createHashRouter(createRoutesFromElements(Routes));

  useEffect(() => {
    shell?.ux?.hidePreloader();
  }, [shell.ux]);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<FullPageSpinner />}>
        <RouterProvider router={router} />
      </Suspense>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;

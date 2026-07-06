import React, { Suspense, useContext, useEffect } from 'react';

import { RouterProvider, createHashRouter, createRoutesFromElements } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import Routes from '@/routes/Routes';

import queryClient from './QueryClient';

function App() {
  const { shell } = useContext(ShellContext);

  const router = createHashRouter(createRoutesFromElements(Routes));

  useEffect(() => {
    const hidePreloader = async () => {
      try {
        await shell?.ux?.hidePreloader?.();
      } catch (err) {
        console.error('Failed to hide preloader:', err);
      }
    };

    void hidePreloader();
  }, [shell]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Suspense ensures lazy-loaded route components show a fallback UI */}
      <Suspense fallback={<span>Loading routes ...</span>}>
        <RouterProvider router={router} />
      </Suspense>

      {/* React Query Devtools are included for development and debugging */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;

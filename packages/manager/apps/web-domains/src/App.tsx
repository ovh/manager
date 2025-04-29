import React, { useEffect, useContext, Suspense } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Routes from '@/alldoms/routes/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
    },
  },
});

function App() {
  const { shell } = useContext(ShellContext);
  const routes = createHashRouter(createRoutesFromElements(Routes));

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense>
        <RouterProvider router={routes} />
      </Suspense>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;

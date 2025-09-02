import React, { useEffect, useContext, Suspense } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import routes from '@/routes/routes';
import Loading from '@/components/Loading/Loading';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
    },
  },
});

function App() {
  const { shell } = useContext(ShellContext);
  const router = createHashRouter(createRoutesFromElements(routes));

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;

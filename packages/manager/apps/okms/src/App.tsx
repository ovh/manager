import React, { useEffect, Suspense } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import secretManagerRoutes from '@secret-manager/routes/routes';
import rootRoutes from '@/routes/rootRoutes';
import kmsRoutes from '@/routes/routes';
import Loading from '@/components/Loading/Loading';
import { useShellContext } from '@/common/hooks/useShellContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
    },
  },
});

function App() {
  const { shell } = useShellContext();
  const router = createHashRouter(
    createRoutesFromElements([rootRoutes, kmsRoutes, secretManagerRoutes]),
  );

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

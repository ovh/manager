import { Suspense, useEffect } from 'react';

import { RouterProvider, createHashRouter, createRoutesFromElements } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Loading from '@/common/components/loading/Loading';
import { useShellContext } from '@/common/hooks/useShellContext';
import rootRoutes from '@/common/routes/routes';
import { queryClient } from '@/common/utils/react-query/queryClient';

function App() {
  const { shell } = useShellContext();
  const router = createHashRouter(createRoutesFromElements(rootRoutes));

  useEffect(() => {
    shell.ux.hidePreloader();
  }, [shell.ux]);

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

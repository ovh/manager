import { Suspense } from 'react';

import { RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom';

import kmsRoutes from '@key-management-service/routes/routes';
import secretManagerRoutes from '@secret-manager/routes/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Loading from '@/common/components/loading/Loading';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
});

export function TestApp({ initialRoute = '/' }: { initialRoute: string }) {
  const router = createMemoryRouter(createRoutesFromElements([kmsRoutes, secretManagerRoutes]), {
    initialEntries: [initialRoute],
    initialIndex: 0,
  });

  queryClient.clear();

  return (
    <Suspense fallback={<Loading />}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Suspense>
  );
}

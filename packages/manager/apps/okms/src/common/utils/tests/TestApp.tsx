import React, { Suspense } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
  createMemoryRouter,
  RouterProvider,
  createRoutesFromElements,
} from 'react-router-dom';
import secretManagerRoutes from '@secret-manager/routes/routes';
import kmsRoutes from '@key-management-service/routes/routes';
import Loading from '@/common/components/loading/Loading';

export function TestApp({ initialRoute = '/' }: { initialRoute: string }) {
  const router = createMemoryRouter(
    createRoutesFromElements([kmsRoutes, secretManagerRoutes]),
    {
      initialEntries: [initialRoute],
      initialIndex: 0,
    },
  );

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return (
    <Suspense fallback={<Loading />}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Suspense>
  );
}

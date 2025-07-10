import React, { Suspense } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
  createMemoryRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import routes from '@/routes/routes';
import Loading from '@/components/Loading.component';

export function TestApp({ initialRoute = '/' }: { initialRoute: string }) {
  const router = createMemoryRouter(createRoutesFromElements(routes), {
    initialEntries: [initialRoute],
    initialIndex: 0,
  });

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

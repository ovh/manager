import React, { Suspense } from 'react';

import {
  RouterProvider,
  createMemoryRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Routes from '@/routes/routes';

export function TestApp({ initialRoute = '/ip' }: { initialRoute?: string }) {
  const routes = React.useMemo(
    () =>
      createMemoryRouter(createRoutesFromElements(Routes), {
        initialEntries: [initialRoute],
        initialIndex: 0,
      }),
    [initialRoute],
  );

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<span>Loading routes ...</span>}>
        <RouterProvider router={routes} />
      </Suspense>
    </QueryClientProvider>
  );
}

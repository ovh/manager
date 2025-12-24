import React from 'react';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Routes } from '../routes/routes';

export function TestApp({ initialRoute = '/ip' }: { initialRoute?: string }) {
  const router = React.useMemo(
    () =>
      createMemoryRouter(Routes, {
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
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

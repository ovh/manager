import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '../routes/routes';

export function TestApp({ initialRoute = '/' }) {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialRoute],
    initialIndex: 0,
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
    </QueryClientProvider>
  );
}

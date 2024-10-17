import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Routes } from '../../routes/routes';

export function TestApp() {
  const router = createMemoryRouter(Routes, {
    initialEntries: ['/'],
    initialIndex: 0,
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Routes } from '../routes/routes';
import { MessageContextProvider } from '@/context/Message.context';

export function TestApp({ initialRoute = '/' }) {
  const router = createMemoryRouter(Routes, {
    initialEntries: [initialRoute],
    initialIndex: 0,
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MessageContextProvider>
        <RouterProvider router={router} />
      </MessageContextProvider>
    </QueryClientProvider>
  );
}

import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { getRoutes } from '../routes/routes';
import { MessageContextProvider } from '../components/feedback-messages/Messages.context';

export function TestApp({ initialRoute = '/' }) {
  const router = createMemoryRouter(getRoutes(), {
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

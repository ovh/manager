import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MessageContextProvider } from '@/components/Messages/Messages.context';
import { routes } from '@/routes/routes';

export function TestApp({ initialRoute = '/' }: { initialRoute?: string }) {
  const router = createMemoryRouter(routes, {
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

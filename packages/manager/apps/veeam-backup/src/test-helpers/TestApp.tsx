import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
  createMemoryRouter,
  RouterProvider,
  createRoutesFromElements,
} from 'react-router-dom';
import { MessageContextProvider } from '@/components/Messages/Messages.context';
import Routes from '@/routes/routes';

export function TestApp({ initialRoute = '/' }: { initialRoute?: string }) {
  const routes = createMemoryRouter(createRoutesFromElements(Routes), {
    initialEntries: [initialRoute],
    initialIndex: 0,
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MessageContextProvider>
        <RouterProvider router={routes} />
      </MessageContextProvider>
    </QueryClientProvider>
  );
}

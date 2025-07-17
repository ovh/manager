import React, { Suspense } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
  createMemoryRouter,
  RouterProvider,
  createRoutesFromElements,
} from 'react-router-dom';
import Routes from '@/routes/routes';
import { MessageContextProvider } from '../components/feedback-messages/Messages.context';

export function TestApp({ initialRoute = '/' }) {
  const router = createMemoryRouter(createRoutesFromElements(Routes), {
    initialEntries: [initialRoute],
    initialIndex: 0,
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MessageContextProvider>
        <Suspense fallback={<span>Loading routes ...</span>}>
          <RouterProvider router={router} />
        </Suspense>
      </MessageContextProvider>
    </QueryClientProvider>
  );
}

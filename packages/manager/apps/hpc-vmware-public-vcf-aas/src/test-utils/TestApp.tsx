import React, { Suspense } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
  createMemoryRouter,
  RouterProvider,
  createRoutesFromElements,
} from 'react-router-dom';
import Routes from '@/routes/routes';
import { MessageContextProvider } from '@/context/Message.context';
import Loading from '@/components/loading/Loading.component';

export function TestApp({ initialRoute = '/' }) {
  const routes = createRoutesFromElements(Routes);
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
        <Suspense fallback={<Loading />}>
          <RouterProvider router={router} />
        </Suspense>
      </MessageContextProvider>
    </QueryClientProvider>
  );
}

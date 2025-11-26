import React from 'react';

import { RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Loading from '@/components/loading/Loading.component';
import { MessageContextProvider } from '@/context/Message.context';
import Routes from '@/routes/routes';

export function TestApp({ initialRoute = '/' }: { initialRoute?: string }) {
  const routes = createRoutesFromElements(Routes);
  const router = createMemoryRouter(routes, {
    initialEntries: [initialRoute],
    initialIndex: 0,
  });

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MessageContextProvider>
        <React.Suspense fallback={<Loading />}>
          <RouterProvider router={router} />
        </React.Suspense>
      </MessageContextProvider>
    </QueryClientProvider>
  );
}

import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
  createMemoryRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { logsRoutes } from '../routes/routes';

const lazyRouteConfig = (importFn: CallableFunction) => {
  return {
    lazy: async () => {
      const { default: moduleDefault, ...moduleExports } = await importFn();

      return {
        Component: moduleDefault,
        ...moduleExports,
      };
    },
  };
};

const appRoutes: RouteObject[] = [
  {
    path: '/*',
    ...lazyRouteConfig(() => import('./MockedAppPage')),
    children: [...logsRoutes],
  },
];

export function TestApp({ initialRoute = '/' }) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [initialRoute],
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

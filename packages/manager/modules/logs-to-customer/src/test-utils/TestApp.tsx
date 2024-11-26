import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
  createMemoryRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { vi } from 'vitest';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
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

const shellContext = {
  environment: {
    getUser: vi.fn(),
    getUserLocale: vi.fn().mockReturnValue('fr_FR'),
    getRegion: vi.fn(),
  },
  shell: {
    navigation: {
      getURL: vi.fn().mockResolvedValue('mocked-url'),
    },
    tracking: {
      trackClick: vi.fn(),
    },
    environment: {
      getEnvironment: () => ({
        getRegion: vi.fn(() => 'EU'),
        getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
      }),
    },
  },
  useNavigation: () => ({
    navigateTo: vi.fn(),
  }),
};

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
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <RouterProvider router={router} />
      </ShellContext.Provider>
    </QueryClientProvider>
  );
}

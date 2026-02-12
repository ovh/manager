import React from 'react';

import type { RouteObject } from 'react-router-dom';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

import type { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { lazyRouteConfig } from '@/routes/routes';

const appRoutes: RouteObject[] = [
  {
    path: '/*',
    ...lazyRouteConfig(() => import('./MockedAppPage')),
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

export function TestApp({ initialRoute = '/' }: { initialRoute?: string }) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [initialRoute],
    initialIndex: 0,
    future: {
      v7_relativeSplatPath: true,
    },
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </ShellContext.Provider>
    </QueryClientProvider>
  );
}

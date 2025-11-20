import React, { ReactNode } from 'react';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

type ShellContextType = React.ComponentProps<typeof ShellContext.Provider>['value'];

export const shellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'FR' }),
    getRegion: () => 'EU',
  },
  shell: {
    navigation: {
      navigateTo: vi.fn(),
      getURL: vi.fn().mockImplementation((app, path) => {
        if (app === 'dedicated' && path === '#/billing/history') {
          return Promise.resolve('https://billing-url');
        }
        if (app === 'dedicated' && path === '#/contacts/services') {
          return Promise.resolve('https://contacts-url');
        }
        return Promise.resolve('https://mocked-url');
      }),
    },
  },
} as unknown as ShellContextType;

export const createWrapper = (contextValue: ShellContextType = shellContext) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 300_000,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider value={contextValue}>
        <MemoryRouter>{children}</MemoryRouter>
      </ShellContext.Provider>
    </QueryClientProvider>
  );
  return Wrapper;
};

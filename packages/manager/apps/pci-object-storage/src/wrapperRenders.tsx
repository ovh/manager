import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { vi } from 'vitest';

import React from 'react';

export const shellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
  },
  shell: {
    navigation: {
      getURL: vi.fn(),
    },
    tracking: {
      trackPage: vi.fn(),
      trackClick: vi.fn(),
    },
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

export const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

export const mockShellContext = {
  environment: {
    getRegion: vi.fn().mockReturnValue('EU'),
    getUser: vi.fn().mockReturnValue({}),
    getApplication: vi.fn(),
  },
  navigation: {
    getURL: vi.fn(),
  },
  tracking: {
    trackPage: vi.fn(),
    trackClick: vi.fn(),
  },
};

export const wrapperOffsiteReplication = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider value={mockShellContext as any}>
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

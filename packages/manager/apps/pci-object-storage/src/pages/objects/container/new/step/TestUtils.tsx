import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { vi } from 'vitest';
import React from 'react';

const queryClient = new QueryClient();

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

export const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider value={mockShellContext as any}>
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

import { ReactNode } from 'react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';

export const shellContext = ({
  environment: {
    getUser: () => ({ ovhSubsidiary: 'FR' }),
    getRegion: () => 'EU',
  },
  shell: {
    navigation: {
      navigateTo: vi.fn(),
    },
  },
} as unknown) as ShellContextType;

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

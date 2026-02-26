import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

export const mockShellContext = ({
  environment: {
    user: {
      ovhSubsidiary: 'FR',
    },
  },
  shell: {},
} as unknown) as ShellContextType;

export const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider value={mockShellContext}>
        {children}
      </ShellContext.Provider>
    </QueryClientProvider>
  );
};

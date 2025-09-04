import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';

const queryClient = new QueryClient();

export const mockShellContext = ({
  environment: {
    user: {
      ovhSubsidiary: 'FR',
    },
    getUser: () => ({ ovhSubsidiary: 'FR' }),
    getUserLocale: () => ({}),
    getRegion: () => ({}),
  },
  shell: {
    navigation: {
      getURL: (_: unknown, path: string): Promise<string> => {
        return new Promise<string>((resolve) => {
          return resolve(`https://ovh.test/#${path}`);
        });
      },
    },
  },
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

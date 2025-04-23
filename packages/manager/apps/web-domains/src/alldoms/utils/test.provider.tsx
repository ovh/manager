import React from 'react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
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
  },
  shell: {}, // 👈 on met un objet vide
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

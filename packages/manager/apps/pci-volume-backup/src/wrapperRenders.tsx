import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { vi } from 'vitest';
import { ErrorBoundary } from 'react-error-boundary';
import queryClient from './queryClient';

export const shellContext = ({
  environment: {
    getUser: () => ({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
  },
  shell: {
    navigation: {
      navigateTo: vi.fn(),
      getURL: vi.fn(),
    },
  },
} as unknown) as ShellContextType;

export const createWrapper = () => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider value={shellContext}>
        <ErrorBoundary fallbackRender={() => <div>error boundary</div>}>
          {children}
        </ErrorBoundary>
      </ShellContext.Provider>
    </QueryClientProvider>
  );
  return Wrapper;
};

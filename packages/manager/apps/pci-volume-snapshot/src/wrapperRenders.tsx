import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { vi } from 'vitest';
import { ErrorBoundary } from 'react-error-boundary';

export const shellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
  },
  shell: {
    navigation: {
      getURL: vi.fn(),
    },
  },
};

export const createWrapper = () => {
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
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <ErrorBoundary fallbackRender={() => <div>error boundary</div>}>
          {children}
        </ErrorBoundary>
      </ShellContext.Provider>
    </QueryClientProvider>
  );
  return Wrapper;
};

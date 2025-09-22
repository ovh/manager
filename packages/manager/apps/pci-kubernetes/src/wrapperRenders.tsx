import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

export const shellContext = {
  environment: {
    getRegion: vi.fn().mockReturnValue('EU'),
    getUser: () => ({
      ovhSubsidiary: 'mocked_ovhSubsidiary',
      currency: { code: 'EUR' },
    }),
  },
  shell: {
    navigation: {
      getURL: vi.fn(),
    },
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

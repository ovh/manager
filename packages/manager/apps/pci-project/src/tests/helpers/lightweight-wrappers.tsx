import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';
import { vi } from 'vitest';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { MemoryRouter } from 'react-router-dom';

// Default shell context for compatibility with existing tests
export const shellContext = ({
  environment: {
    getUser: () => ({ ovhSubsidiary: 'FR' }),
    getRegion: () => 'EU',
    getApplicationURLs: () => ({
      dedicated: 'https://dedicated.example.com',
      publicCloud: 'https://public-cloud.example.com',
    }),
  },
  shell: {
    navigation: {
      navigateTo: vi.fn(),
      getURL: vi.fn().mockImplementation((app, path) => {
        if (app === 'dedicated' && path === '#/billing/history') {
          return Promise.resolve('https://billing-url');
        }
        return Promise.resolve('');
      }),
      getURLs: vi.fn().mockResolvedValue({
        dedicated: 'https://dedicated.example.com',
        publicCloud: 'https://public-cloud.example.com',
      }),
    },
    i18n: {
      getLocale: () => 'fr_FR',
      setLocale: vi.fn(),
    },
    auth: {
      getUser: () => Promise.resolve({ ovhSubsidiary: 'FR' }),
    },
  },
} as unknown) as ShellContextType;

// Wrapper minimal pour les composants simples (sans routing ni shell)
export const createMinimalWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Wrapper pour les composants avec navigation (ajoute MemoryRouter)
export const createNavigationWrapper = (initialEntries = ['/']) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

// Wrapper pour les composants avec shell (ajoute ShellContext)
export const createShellWrapper = (customShellContext?: ShellContextType) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false },
    },
  });

  // Use custom context if provided, otherwise use the default exported shellContext
  const contextToUse = customShellContext || shellContext;

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider value={contextToUse}>
        <MemoryRouter>{children}</MemoryRouter>
      </ShellContext.Provider>
    </QueryClientProvider>
  );
};

// Factory pour choisir le bon wrapper selon les besoins
export const createOptimalWrapper = (
  needs: {
    routing?: boolean;
    shell?: boolean;
    queries?: boolean;
    shellOverrides?: any;
    initialEntries?: string[];
  } = {},
  customShellContext?: ShellContextType,
) => {
  const {
    routing = false,
    shell = false,
    queries = true,
    shellOverrides,
    initialEntries,
  } = needs;

  if (shell) {
    return createShellWrapper(customShellContext || shellOverrides);
  }

  if (routing) {
    return createNavigationWrapper(initialEntries);
  }

  if (queries) {
    return createMinimalWrapper();
  }

  // Wrapper vide pour les composants purement React
  return ({ children }: { children: ReactNode }) => <>{children}</>;
};

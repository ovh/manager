/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Configuration du contexte shell pour les tests
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

// Configuration du QueryClient pour les tests
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Reduce stale time for faster tests
        staleTime: 0,
        // Disable retries for faster test execution
        retry: false,
        // Reduce retry delay
        retryDelay: 1,
        // Disable background refetching
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
      },
      mutations: {
        // Disable retries for mutations
        retry: false,
        retryDelay: 1,
      },
    },
  });
};

// Wrapper React principal pour les tests
export const createTestWrapper = (
  contextValue: ShellContextType = shellContext,
  initialEntries: string[] = ['/'],
) => {
  const queryClient = createTestQueryClient();

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider value={contextValue}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </ShellContext.Provider>
    </QueryClientProvider>
  );

  return Wrapper;
};

// Wrapper spécialisé pour les tests de pages avec navigation
export const createPageTestWrapper = (
  contextValue: ShellContextType = shellContext,
  initialPath = '/',
) => {
  return createTestWrapper(contextValue, [initialPath]);
};

// Wrapper spécialisé pour les tests de hooks
export const createHookTestWrapper = (
  contextValue: ShellContextType = shellContext,
) => {
  const queryClient = createTestQueryClient();

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider value={contextValue}>
        {children}
      </ShellContext.Provider>
    </QueryClientProvider>
  );

  return Wrapper;
};

// Wrapper spécialisé pour les tests de composants avec erreurs
export const createErrorBoundaryTestWrapper = (
  contextValue: ShellContextType = shellContext,
) => {
  const queryClient = createTestQueryClient();

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider value={contextValue}>
        <MemoryRouter>
          <div data-testid="error-boundary-wrapper">{children}</div>
        </MemoryRouter>
      </ShellContext.Provider>
    </QueryClientProvider>
  );

  return Wrapper;
};

// Utilitaires pour les tests
export const testWrapperUtils = {
  // Créer un contexte shell personnalisé
  createCustomShellContext: (overrides: Partial<ShellContextType> = {}) =>
    ({
      ...shellContext,
      ...overrides,
    } as ShellContextType),

  // Créer un QueryClient personnalisé
  createCustomQueryClient: (options: any = {}) => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 0,
          retry: false,
          retryDelay: 1,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          refetchOnMount: false,
          ...options.queries,
        },
        mutations: {
          retry: false,
          retryDelay: 1,
          ...options.mutations,
        },
      },
    });
  },

  // Nettoyer les mocks après les tests
  cleanupMocks: () => {
    vi.clearAllMocks();
  },

  // Attendre que les requêtes soient terminées
  waitForQueries: async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  },
};

// Exports de compatibilité pour les tests existants
// @deprecated Use createTestWrapper instead
export const createWrapper = createTestWrapper;

// @deprecated Use createPageTestWrapper instead
export const createPageWrapper = createPageTestWrapper;

// @deprecated Use createHookTestWrapper instead
export const createHookWrapper = createHookTestWrapper;

// @deprecated Use createErrorBoundaryTestWrapper instead
export const createErrorBoundaryWrapper = createErrorBoundaryTestWrapper;

// @deprecated Use testWrapperUtils instead
export const testUtils = testWrapperUtils;

import React, { ComponentType } from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TestPage from './test.page';
import type { ReactNode } from 'react';

import { MemoryRouter } from 'react-router-dom';

import { vi } from 'vitest';

import type { Environment } from '@ovh-ux/manager-config';
import {
  ShellContext,
  ShellContextType,
  TrackingContextParams,
} from '@ovh-ux/manager-react-shell-client';
import { ShellClientApi } from '@ovh-ux/shell';
import { ClientNavigationApi } from '@ovh-ux/shell/dist/types/plugin/navigation';

type ProvidersOptions = {
    shell?: Partial<ShellClientApi>;
    environment?: Partial<Environment>;
    tracking?: TrackingContextParams;
    route?: string;
  };
  
  export function createMockNavigation(
    overrides?: Partial<ClientNavigationApi>,
  ): ClientNavigationApi {
    return {
      getURL: vi.fn(),
      navigateTo: vi.fn(),
      reload: vi.fn(),
      ...(overrides ?? {}),
    };
  }
  
  export function createMockShell(overrides?: Partial<ShellClientApi>): ShellClientApi {
    return {
      navigation: createMockNavigation(),
      ...(overrides ?? {}),
    } as ShellClientApi;
  }
  
  export function createWrapper(opts?: ProvidersOptions) {
    return function Wrapper({ children }: { children: ReactNode }) {
      const value: ShellContextType = {
        shell: createMockShell(opts?.shell),
        environment: (opts?.environment ?? {}) as Environment,
        ...(opts?.tracking !== undefined ? { tracking: opts.tracking } : {}),
      };
  
      return (
        <ShellContext.Provider value={value}>
          <MemoryRouter initialEntries={[opts?.route ?? '/']}>{children}</MemoryRouter>
        </ShellContext.Provider>
      );
    };
  }

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  const RouterWrapper = createWrapper();
  return (
    <RouterWrapper>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RouterWrapper>
  );
};

describe('Listing page', () => {
  it('should render the listing page', () => {
    render(<TestPage />, { wrapper: Wrappers as ComponentType });
    expect(screen.getByText('Listing')).toBeInTheDocument();
  });
});
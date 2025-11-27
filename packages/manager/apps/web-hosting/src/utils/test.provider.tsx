import React, { ComponentType } from 'react';
import type { ReactNode } from 'react';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { RenderOptions, RenderResult, render, renderHook } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import 'element-internals-polyfill';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { vi } from 'vitest';

import type { Environment } from '@ovh-ux/manager-config';
import {
  ShellContext,
  ShellContextType,
  TrackingContextParams,
} from '@ovh-ux/manager-react-shell-client';
import { ShellClientApi } from '@ovh-ux/shell';
import type { ClientNavigationApi } from '@ovh-ux/shell/dist/types/plugin/navigation';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import dashboardTranslation from '@/public/translations/dashboard/Messages_fr_FR.json';
import multisiteTranslation from '@/public/translations/multisite/Messages_fr_FR.json';
import onboardingTranslation from '@/public/translations/onboarding/Messages_fr_FR.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'fr',
    fallbackLng: 'fr',
    resources: {
      fr: {
        common: commonTranslation,
        dashboard: dashboardTranslation,
        onboarding: onboardingTranslation,
        multisite: multisiteTranslation,
      },
    },
    ns: ['common', 'onboarding', 'multisite', 'dashboard'],
  })
  .catch(console.error);

export { i18n };

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
    getURL: vi.fn().mockResolvedValue('test-url'),
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
      environment: (opts?.environment ?? {
        getRegion: () => 'FR',
        getUser: () => ({ ovhSubsidiary: 'FR' }),
      }) as Environment,
      ...(opts?.tracking !== undefined ? { tracking: opts.tracking } : {}),
    };

    return (
      <ShellContext.Provider value={value}>
        <MemoryRouter initialEntries={[opts?.route ?? '/']}>{children}</MemoryRouter>
      </ShellContext.Provider>
    );
  };
}

export const getShellContext = (): ShellContextType => {
  const mockRouting = {
    onHashChange: vi.fn(),
    stopListenForHashChange: vi.fn(),
    listenForHashChange: vi.fn(),
  };

  const mockUx: Partial<ShellClientApi['ux']> = {
    hidePreloader: vi.fn(),
  };

  return {
    environment: {
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
      getRegion: () => 'EU',
      getUserLocale: () => 'fr_FR',
    },
    shell: createMockShell({
      routing: mockRouting as ShellClientApi['routing'],
      ux: mockUx as ShellClientApi['ux'],
    }),
  } as ShellContextType;
};

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

export const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider value={getShellContext()}>
        <MemoryRouter>{children}</MemoryRouter>
      </ShellContext.Provider>
    </QueryClientProvider>
  );
};

export const wrapperWithI18n = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ShellContext.Provider value={getShellContext()}>
          <MemoryRouter>{children}</MemoryRouter>
        </ShellContext.Provider>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

/**
 * Creates a complete test wrapper with all providers (ShellContext, Router, QueryClient, i18n)
 * Use this in tests that need all providers but want to customize the QueryClient or route
 */
export function createTestWrapper(opts?: ProvidersOptions & { queryClient?: QueryClient }) {
  const RouterWrapper = createWrapper();
  const testQueryClient = opts?.queryClient ?? queryClient;

  return function TestWrapper({ children }: { children: React.ReactElement }) {
    <RouterWrapper>
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    </RouterWrapper>;
  };
}

const customRender = (jsx: React.ReactNode, options?: RenderOptions): RenderResult =>
  render(jsx, { wrapper: wrapperWithI18n as ComponentType, ...options });

const customRenderHook = (props: (initialsProps: unknown) => unknown, options?: RenderOptions) =>
  renderHook(props, { wrapper: wrapper as ComponentType, ...options });

export function setup(
  jsx: React.ReactElement,
  options?: RenderOptions,
): RenderResult & { user: UserEvent } {
  return {
    user: userEvent.setup(),
    ...customRender(jsx, options),
  };
}
export * from '@testing-library/react';
export { setup as render, customRenderHook as renderHook };

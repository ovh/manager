import React from 'react';

import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { RenderResult, render as reactRender } from '@testing-library/react';
import 'element-internals-polyfill';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';

import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

export const getShellContext = () => {
  return {
    environment: {
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
      getRegion: () => 'EU',
      getUserLocale: () => 'fr_FR',
    },
    shell: {
      routing: {
        onHashChange: () => undefined,
        stopListenForHashChange: () => undefined,
        listenForHashChange: () => undefined,
      },
      ux: {
        hidePreloader: () => undefined,
      },
    },
  } as ShellContextType;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function render(ui: React.ReactElement, { route = '/' } = {}): RenderResult {
  const router = createMemoryRouter([{ path: route, element: ui }], { initialEntries: [route] });
  return reactRender(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ShellContext.Provider value={getShellContext()}>
          <RouterProvider router={router} />
        </ShellContext.Provider>
      </I18nextProvider>
    </QueryClientProvider>,
  );
}

export const wrapper = ({ children }: { children: React.ReactNode }) => {
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

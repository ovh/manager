import * as React from 'react';

import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';

import { ShellContext, type ShellContextType } from '@ovh-ux/manager-react-shell-client';

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
      navigation: {
        getURL: vi.fn().mockResolvedValue('test-url'),
      },
    },
  } as unknown as ShellContextType;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}): RenderResult {
  const router = createMemoryRouter([{ path: route, element: ui }], { initialEntries: [route] });
  return render(
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

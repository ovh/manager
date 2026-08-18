import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderResult, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import {
  ShellContext,
  ShellContextType,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';

import { initTestI18n } from './i18ntest.utils';

export const createQueryClientTest = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity }, mutations: { retry: false } },
  });

let shellContext: ShellContextType;

export const renderWithProviders = async (
  children: React.ReactNode,
  {
    initialEntries = ['/'],
    queryClient = createQueryClientTest(),
  }: { initialEntries?: string[]; queryClient?: QueryClient } = {},
): Promise<RenderResult> => {
  const i18n = await initTestI18n();
  if (!shellContext) {
    shellContext = await initShellContext('no-app');
  }

  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider value={shellContext}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
        </I18nextProvider>
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

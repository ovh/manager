import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderResult, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import { initTestI18n } from './i18ntest.utils';

export const createQueryClientTest = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity }, mutations: { retry: false } },
  });

export const renderWithProviders = async (
  children: React.ReactNode,
  { initialEntries = ['/'] }: { initialEntries?: string[] } = {},
): Promise<RenderResult> => {
  const i18n = await initTestI18n();
  const queryClient = createQueryClientTest();

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );
};

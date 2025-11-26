import React, { ComponentType } from 'react';

import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, it } from 'vitest';

import Topbar from '@/components/topBar/TopBar.component';
import { createWrapper, i18n } from '@/utils/test.provider';

const testQueryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const RouterWrapper = createWrapper();

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  return (
    <RouterWrapper>
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    </RouterWrapper>
  );
};

describe('Topbar component', () => {
  it('should display Topbar component', () => {
    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const orderSsl = screen.getByTestId('order-ssl');
    const importrSsl = screen.getByTestId('import-ssl');
    expect(orderSsl).toBeInTheDocument();
    expect(importrSsl).toBeInTheDocument();
  });
});

import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, vi } from 'vitest';

import { managedWordpressWebsitesMock } from '@/data/__mocks__/managedWordpress/website';
import ManagedWordpressTranslations from '@/public/translations/common/Messages_fr_FR.json';
import { createWrapper, i18n } from '@/utils/test.provider';

import MyWebsitesPage from './MyWebsites.page';

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

vi.mock(
  '@/data/hooks/managedWordpress/managedWordpressWebsites/useManagedWordpressWebsites',
  () => ({
    useManagedWordpressWebsites: vi.fn(() => ({
      data: managedWordpressWebsitesMock,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchAllPages: vi.fn(),
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    })),
  }),
);

vi.mock(
  '@/data/hooks/managedWordpress/managedWordpressResourceDetails/useManagedWordpressResourceDetails',
  () => ({
    useManagedWordpressResourceDetails: vi.fn(() => ({
      data: null,
      refetch: vi.fn(),
    })),
  }),
);

vi.mock('@ovh-ux/muk', () => ({
  Datagrid: ({
    columns,
    ...props
  }: React.PropsWithChildren<{
    columns?: Array<{ id: string; header?: string }>;
    [key: string]: unknown;
  }>) => (
    <div data-testid="datagrid" {...props}>
      {columns?.map((column) => (
        <div key={column.id} data-testid={`header-${column.id}`}>
          {column.header || column.id}
        </div>
      ))}
    </div>
  ),
  ActionMenu: ({
    id,
    items,
    ...props
  }: React.PropsWithChildren<{
    id?: string;
    items?: Array<{ id: number; label: string }>;
    [key: string]: unknown;
  }>) => (
    <div data-testid="action-menu" data-id={id} {...props}>
      {items?.map((item) => (
        <button key={item.id} data-testid={`action-item-${item.id}`}>
          {item.label}
        </button>
      ))}
    </div>
  ),
}));
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

describe('ManagedWordpressPage Page', () => {
  it('should render page with content', () => {
    const { getByTestId } = render(<MyWebsitesPage />, { wrapper: Wrappers as ComponentType });
    const sortedRows = getByTestId('header-defaultFQDN');

    expect(sortedRows).toHaveTextContent(
      ManagedWordpressTranslations.web_hosting_status_header_fqdn,
    );
  });
});

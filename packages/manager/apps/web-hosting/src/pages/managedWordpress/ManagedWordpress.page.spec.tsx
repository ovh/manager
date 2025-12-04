import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, vi } from 'vitest';

import { managedWordpressResourceMock } from '@/data/__mocks__/managedWordpress/ressource';
import ManagedWordpressTranslations from '@/public/translations/common/Messages_fr_FR.json';
import { createWrapper, i18n } from '@/utils/test.provider';

import ManagedWordpressPage from './ManagedWordpress.page';

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
  '@/data/hooks/managedWordpress/managedWordpressResource/useManagedWordpressResource',
  () => ({
    useManagedWordpressResource: vi.fn(() => ({
      data: managedWordpressResourceMock,
      isLoading: false,
    })),
  }),
);

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
    const { getByTestId } = render(<ManagedWordpressPage />, {
      wrapper: Wrappers as ComponentType,
    });
    const sortedRows = getByTestId('header-id');

    expect(sortedRows).toHaveTextContent(
      ManagedWordpressTranslations.web_hosting_status_header_resource,
    );
  });
});

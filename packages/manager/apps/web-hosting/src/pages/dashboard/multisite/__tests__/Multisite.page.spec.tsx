import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WebHostingWebsiteDomainMocks, WebHostingWebsiteMocks } from '@/data/__mocks__/websites';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { createWrapper, i18n } from '@/utils/test.provider';

import MultisitePage from '../Multisite.page';

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

vi.mock('@/data/hooks/webHosting/webHostingWebsite/useWebHostingWebsite', () => ({
  useWebHostingWebsite: vi.fn().mockReturnValue({
    data: WebHostingWebsiteMocks,
    isLoading: false,
  }),
}));

vi.mock('@/data/hooks/webHosting/webHostingWebsiteDomain/webHostingWebsiteDomain', () => ({
  useWebHostingWebsiteDomain: vi.fn().mockReturnValue({
    data: WebHostingWebsiteDomainMocks,
    isLoading: false,
    refetch: vi.fn(),
  }),
  useWebHostingWebsiteDomains: vi.fn().mockReturnValue([
    {
      data: WebHostingWebsiteDomainMocks,
      isLoading: false,
      refetch: vi.fn(),
    },
  ]),
}));

describe('MultisitePage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Datagrid and its topbar button', async () => {
    const { getByTestId } = render(<MultisitePage />, { wrapper: Wrappers as ComponentType });

    await waitFor(() => {
      expect(getByTestId('add-website-button')).toBeInTheDocument();
    });
    const button = getByTestId('add-website-button');
    expect(button).toHaveTextContent(commonTranslation.add_website);
  });
});

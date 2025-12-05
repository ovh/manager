import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { managedWordpressWebsitesMock } from '@/data/__mocks__/managedWordpress/website';
import ManagedWordpressTranslations from '@/public/translations/common/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';

import MyWebsitesPage from '../ManagedWordpressResource/myWebsites/MyWebsites.page';

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
      data: {
        currentState: {
          dashboards: { wordpress: 'https://example.com' },
          quotas: { websites: { totalUsage: 1, totalQuota: 10 } },
        },
      },
      refetch: vi.fn(),
    })),
  }),
);

describe('MyWebsitesPage Topbar Buttons', () => {
  it('should render page with content', () => {
    const { getByTestId } = render(<MyWebsitesPage />, { wrapper });
    const sortedRows = getByTestId('header-defaultFQDN');

    expect(sortedRows).toHaveTextContent(
      ManagedWordpressTranslations.web_hosting_status_header_fqdn,
    );
  });
  it('should render all topbar buttons', () => {
    render(<MyWebsitesPage />, { wrapper });

    expect(screen.getByTestId('my-websites-create')).toBeInTheDocument();
    expect(screen.getByTestId('my-websites-import')).toBeInTheDocument();
    expect(screen.getByTestId('my-websites-manage')).toBeInTheDocument();
    expect(screen.getByTestId('refresh')).toBeInTheDocument();
  });
});

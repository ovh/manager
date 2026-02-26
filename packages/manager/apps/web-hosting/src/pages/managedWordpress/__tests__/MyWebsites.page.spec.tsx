import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { managedWordpressWebsitesMock } from '@/data/__mocks__/managedWordpress/website';
import ManagedWordpressTranslations from '@/public/translations/common/Messages_fr_FR.json';
import { renderWithRouter, wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

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
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should render page with content', () => {
    render(<MyWebsitesPage />, { wrapper });

    expect(
      screen.getByText(ManagedWordpressTranslations.web_hosting_status_header_fqdn),
    ).toBeInTheDocument();
  });
  it('should render all topbar buttons', () => {
    render(<MyWebsitesPage />, { wrapper });

    expect(screen.getByTestId('my-websites-create')).toBeInTheDocument();
    expect(screen.getByTestId('my-websites-import')).toBeInTheDocument();
    expect(screen.getByTestId('my-websites-manage')).toBeInTheDocument();
    expect(screen.getByTestId('refresh')).toBeInTheDocument();
  });
  it.skip('should have a valid html with a11y and w3c', async () => {
    const { container } = renderWithRouter(<MyWebsitesPage />);
    // ODS: div inside label (invalid HTML), form elements without accessible names
    // const html = container.innerHTML
    // .replace(/\s*aria-controls="[^"]*"/g, '')
    // .replace(/\s*aria-labelledby="[^"]*"/g, '');
    // await expect(html).toBeValidHtml();
    await expect(container).toBeAccessible();
  });
});

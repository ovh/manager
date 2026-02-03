import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WebHostingWebsiteDomainMocks, WebHostingWebsiteMocks } from '@/data/__mocks__';
import { webHostingMock } from '@/data/__mocks__/webHostingDashboard';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import ActionButtonMultisite from '../ActionButtonMultisite.component';

vi.mock('@/data/hooks/webHosting/webHostingWebsite/useWebHostingWebsite', () => ({
  useWebHostingWebsite: vi.fn().mockReturnValue({
    data: WebHostingWebsiteMocks,
    isLoading: false,
  }),
}));

vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', () => ({
  useGetHostingService: vi.fn().mockReturnValue({
    data: webHostingMock,
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useHostingUrl', () => ({
  useHostingUrl: vi.fn((service: string, path = '') => {
    return `https://hosting.ovh.net/${service}${path ? `/${path}` : ''}`;
  }),
}));

describe('ActionButtonMultisite component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render site actions correctly', () => {
    const { container } = render(<ActionButtonMultisite context="site" siteId={'1'} path="www" />, {
      wrapper,
    });

    expect(container).toBeInTheDocument();

    const menuItems = container.querySelectorAll('button[data-testid^="action-item-"]');
    expect(menuItems.length).toBeGreaterThan(1);

    const labels = Array.from(menuItems).map((el) => el.textContent);
    expect(labels).toContain(commonTranslation.add_domain);
  });

  it('should navigate correctly when clicking a site action', () => {
    const { getByText } = render(<ActionButtonMultisite context="site" siteId={'1'} path="www" />, {
      wrapper,
    });
    const addDomainButton = getByText(commonTranslation.add_domain);
    expect(addDomainButton).toBeInTheDocument();

    addDomainButton.click();
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it('should render domain actions correctly', () => {
    const { container } = render(
      <ActionButtonMultisite
        context="domain"
        domainId={'1'}
        domain="test.site"
        domains={WebHostingWebsiteDomainMocks}
      />,
      { wrapper },
    );

    expect(container).toBeInTheDocument();

    const menuItems = container.querySelectorAll('button[data-testid^="action-item-"]');
    expect(menuItems.length).toBeGreaterThan(1);

    const labels = Array.from(menuItems).map((el) => el.textContent);
    expect(labels).toContain(commonTranslation.modify_domain);
  });
});

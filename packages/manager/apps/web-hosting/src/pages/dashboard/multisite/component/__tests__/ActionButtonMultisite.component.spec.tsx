import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WebHostingWebsiteDomainMocks, WebHostingWebsiteMocks } from '@/data/__mocks__';
import { webHostingMock } from '@/data/__mocks__/webHostingDashboard';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';
import { getDomRect, navigate } from '@/utils/test.setup';

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
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should render site actions correctly', () => {
    const { getByRole } = render(<ActionButtonMultisite context="site" siteId={'1'} path="www" />, {
      wrapper,
    });

    const menuItem = getByRole('button', {
      name: commonTranslation.add_domain,
      hidden: true,
    });
    expect(menuItem).toBeInTheDocument();
    expect(menuItem).toHaveTextContent(commonTranslation.add_domain);
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
    const { container, getByRole } = render(
      <ActionButtonMultisite
        context="domain"
        domainId={'1'}
        domain="test.site"
        domains={WebHostingWebsiteDomainMocks}
      />,
      { wrapper },
    );

    expect(container).toBeInTheDocument();
    const menuItem = getByRole('button', {
      name: commonTranslation.modify_domain,
      hidden: true,
    });
    expect(menuItem).toBeInTheDocument();
    expect(menuItem).toHaveTextContent(commonTranslation.modify_domain);
  });
});

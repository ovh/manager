import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import multisiteTranslation from '@/public/translations/multisite/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';
import { getDomRect, navigate } from '@/utils/test.setup';

import AddWebsitePage from '../AddWebsite.page';

vi.mock('@/data/hooks/webHosting/webHostingWebsiteDomain/webHostingWebsiteDomain', () => ({
  usePostWebHostingWebsites: vi.fn(() => ({
    postWebHostingWebsites: vi.fn(),
    isPending: false,
  })),
}));

describe('AddWebsitePage', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should render correctly', () => {
    const { container } = render(<AddWebsitePage />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should display title', () => {
    render(<AddWebsitePage />, { wrapper });

    expect(screen.getByText(multisiteTranslation.multisite_add_website_title)).toBeInTheDocument();
  });

  it('should navigate back on back link click', () => {
    render(<AddWebsitePage />, { wrapper });

    const backLink = screen.getByText(commonTranslation.web_hosting_common_sites_backlink);
    fireEvent.click(backLink);

    expect(navigate).toHaveBeenCalled();
  });
});

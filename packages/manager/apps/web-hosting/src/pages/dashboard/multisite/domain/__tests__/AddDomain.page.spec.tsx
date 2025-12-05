import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import multisiteTranslation from '@/public/translations/multisite/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import AddWDomainPage from '../AddDomain.page';

vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', () => ({
  useCreateAttachedDomainService: vi.fn(() => ({
    createAttachedDomainService: vi.fn(),
    isPending: false,
  })),
}));

describe('AddWDomainPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const { container } = render(<AddWDomainPage />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should display title', () => {
    render(<AddWDomainPage />, { wrapper });

    expect(screen.getByText(multisiteTranslation.multisite_add_domain_title)).toBeInTheDocument();
  });

  it('should navigate back on back link click', () => {
    render(<AddWDomainPage />, { wrapper });

    const backLink = screen.getByText(commonTranslation.web_hosting_common_sites_backlink);
    fireEvent.click(backLink);

    expect(navigate).toHaveBeenCalled();
  });
});

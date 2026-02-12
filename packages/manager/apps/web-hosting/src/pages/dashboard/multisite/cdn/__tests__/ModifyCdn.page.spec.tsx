import { useParams } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import dashboardTranslation from '@/public/translations/dashboard/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import ModifyCdnPage from '../ModifyCdn.page';

describe('ModifyCdnPage', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.mocked(useParams).mockReturnValue({
      serviceName: 'test-service',
      domain: 'test-domain',
    });
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });

  it('should render correctly', () => {
    const { container } = render(<ModifyCdnPage />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should display title and info', () => {
    render(<ModifyCdnPage />, { wrapper });

    expect(screen.getByText(/Configurer votre CDN/i)).toBeInTheDocument();
  });

  it('should disable validate button when form is not dirty', () => {
    render(<ModifyCdnPage />, { wrapper });

    const validateBtn = screen.getByText(
      dashboardTranslation.cdn_shared_option_cache_rule_btn_validate,
    );
    expect(validateBtn).toBeDisabled();
  });
});

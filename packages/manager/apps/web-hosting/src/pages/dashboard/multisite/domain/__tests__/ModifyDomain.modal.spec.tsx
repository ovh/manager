import { useLocation } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GitStatus, ServiceStatus } from '@/data/types/status';
import { wrapper } from '@/utils/test.provider';
import { getDomRect, navigate } from '@/utils/test.setup';

import ModifyModalDomain from '../ModifyDomain.modal';

vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', () => ({
  useGetHostingService: vi.fn(() => ({
    data: {
      hostingIp: '1.2.3.4',
      countriesIp: [],
      hasHostedSsl: true,
    },
    isLoading: false,
  })),
  useGetDomainZone: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
}));

vi.mock('@/data/api/webHosting', () => ({
  putAttachedDomain: vi.fn(),
}));

describe('ModifyModalDomain', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/test',
      search: '',
      hash: '',
      key: '',
      state: {
        serviceName: 'test-service',
        domain: 'test-domain.com',
        path: '/public_html',
        gitStatus: GitStatus.DISABLED,
        firewallStatus: ServiceStatus.ACTIVE,
        cdnStatus: ServiceStatus.ACTIVE,
      },
    } as ReturnType<typeof useLocation>);
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should render correctly', () => {
    const { container } = render(<ModifyModalDomain />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should navigate to step 2 on next click', async () => {
    render(<ModifyModalDomain />, { wrapper });

    const nextBtn = screen.getByTestId('primary-button');
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByTestId('primary-button')).toBeInTheDocument();
    });
  });

  it('should close modal on cancel', () => {
    render(<ModifyModalDomain />, { wrapper });

    const cancelBtn = screen.getByTestId('secondary-button');
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
  });
});

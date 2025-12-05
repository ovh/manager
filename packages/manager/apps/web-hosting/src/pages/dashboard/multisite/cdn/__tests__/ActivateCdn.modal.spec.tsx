import { useLocation } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import ActivateCdnModal from '../ActivateCdn.modal';

vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', () => ({
  useUpdateAttachedDomainService: vi.fn(() => ({
    updateAttachedDomainService: vi.fn(),
    isPending: false,
  })),
}));

describe('ActivateCdnModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/test',
      search: '',
      hash: '',
      key: '',
      state: {
        serviceName: 'test-service',
        domain: 'test-domain.com',
      },
    } as ReturnType<typeof useLocation>);
  });

  it('should render correctly', () => {
    const { container } = render(<ActivateCdnModal />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('should close modal on cancel', () => {
    render(<ActivateCdnModal />, { wrapper });

    const cancelBtn = screen.getByTestId('secondary-button');
    expect(cancelBtn).not.toBeNull();
    fireEvent.click(cancelBtn);

    expect(navigate).toHaveBeenCalled();
  });
});

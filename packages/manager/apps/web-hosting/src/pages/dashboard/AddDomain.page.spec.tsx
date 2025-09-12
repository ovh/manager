import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach, vi, expect, Mock } from 'vitest';
import AddDomainModal from './AddDomain.page';

import { useCreateAttachedDomainsService } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useParams: () => ({ serviceName: 'serviceName' }),
  useNavigate: () => mockNavigate,
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: () => ({
    addSuccess: vi.fn(),
    addWarning: vi.fn(),
  }),
}));

vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', () => ({
  useCreateAttachedDomainsService: vi.fn(),
  useGetAddDomainExisting: vi.fn(),
  useGetDomainZone: vi.fn(),
  useGetHostingService: vi.fn(),
}));

vi.mock('@/utils/validator', () => ({
  isValidDomain: vi.fn(() => true),
}));

const mockCreateAttachedDomainsService = vi.fn();

beforeEach(() => {
  (useCreateAttachedDomainsService as Mock).mockReturnValue({
    createAttachedDomainsService: mockCreateAttachedDomainsService,
  });
  vi.clearAllMocks();
});

describe('AddDomainModal', () => {
  it('renders modal and step 0 by default', () => {
    render(<AddDomainModal />);
    expect(screen.getByTestId('modal')).not.toBeNull();
    expect(screen.getByText('hosting_add_title')).not.toBeNull();
    expect(screen.getByText('hosting_add_step1_title')).not.toBeNull();
  });

  it('disables next button if domain is not selected in step 0', () => {
    render(<AddDomainModal />);
    const nextBtn = screen.getByTestId('button-next');
    expect(nextBtn.getAttribute('is-disabled')).toBe('true');
  });

  it('disables previous button on first step', () => {
    render(<AddDomainModal />);
    const prevBtn = screen.getByTestId('button-previous');
    expect(prevBtn.getAttribute('is-disabled')).toBe('true');
  });

  it('calls closeModal when cancel button is clicked', async () => {
    render(<AddDomainModal />);
    await fireEvent.click(screen.getByTestId('button-cancel'));
    expect(mockNavigate).toHaveBeenCalled();
  });
});

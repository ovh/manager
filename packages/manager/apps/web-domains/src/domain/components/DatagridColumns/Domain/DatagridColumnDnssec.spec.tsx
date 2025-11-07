import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTranslation } from 'react-i18next';
import DatagridColumnDnssec from './DatagridColumnDnssec';
import { useGetDnssecStatus } from '@/domain/hooks/data/query';
import { wrapper } from '@/common/utils/test.provider';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDnssecStatus: vi.fn(),
}));

vi.mock('@/domain/utils/domainStatus', () => ({
  domainStatusToBadge: vi.fn((mapping, status) => {
    if (status === 'ENABLED') {
      return {
        statusColor: 'success',
        icon: 'check-circle',
        i18nKey: 'domain_dnssec_enabled',
      };
    }
    if (status === 'DISABLED') {
      return {
        statusColor: 'neutral',
        icon: 'x-circle',
        i18nKey: 'domain_dnssec_disabled',
      };
    }
    return null;
  }),
}));

describe('DatagridColumnDnssec', () => {
  const mockServiceName = 'example.com';
  const mockT = vi.fn((key: string) => `translated_${key}`);

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
    });
  });

  it('should render unsupported badge when dnssecStatus is null', () => {
    (useGetDnssecStatus as jest.Mock).mockReturnValue({
      dnssecStatus: null,
    });

    render(<DatagridColumnDnssec serviceName={mockServiceName} />, {
      wrapper,
    });

    const badge = screen.getByTestId('status-badge-unavailable');
    expect(badge).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith(
      'domain_tab_general_information_status_unavailable',
    );
  });

  it('should render enabled badge when DNSSEC is enabled', () => {
    (useGetDnssecStatus as jest.Mock).mockReturnValue({
      dnssecStatus: { status: 'ENABLED' },
    });

    render(<DatagridColumnDnssec serviceName={mockServiceName} />, {
      wrapper,
    });

    const badge = screen.getByTestId('status-badge-ENABLED');
    expect(badge).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith('domain_dnssec_enabled');
  });

  it('should render disabled badge when DNSSEC is disabled', () => {
    (useGetDnssecStatus as jest.Mock).mockReturnValue({
      dnssecStatus: { status: 'DISABLED' },
    });

    render(<DatagridColumnDnssec serviceName={mockServiceName} />, {
      wrapper,
    });

    const badge = screen.getByTestId('status-badge-DISABLED');
    expect(badge).toBeInTheDocument();
    expect(mockT).toHaveBeenCalledWith('domain_dnssec_disabled');
  });

  it('should call useGetDnssecStatus with correct service name', () => {
    (useGetDnssecStatus as jest.Mock).mockReturnValue({
      dnssecStatus: null,
    });

    render(<DatagridColumnDnssec serviceName={mockServiceName} />, {
      wrapper,
    });

    expect(useGetDnssecStatus).toHaveBeenCalledWith(mockServiceName);
  });
});

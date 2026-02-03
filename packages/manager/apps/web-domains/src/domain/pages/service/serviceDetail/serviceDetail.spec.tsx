import '@/common/setupTests';
import React from 'react';
import { Mock, vi } from 'vitest';
import { render, screen, waitFor, wrapper } from '@/common/utils/test.provider';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';
import ServiceDetail from './serviceDetail';
import { ServiceDetailTabsProps } from '@/domain/constants/serviceDetail';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(),
}));

vi.mock('@/domain/pages/domainTabs/dns/dnsConfiguration', () => ({
  default: () => <div>DnsConfigurationTab</div>,
}));

describe('Domain detail', () => {
  it('displays loading spinner while main request are loading', async () => {
    (useGetDomainResource as Mock).mockReturnValue({
      data: null,
      isFetchingDomainResource: true,
    });

    render(<ServiceDetail />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('listing-page-spinner')).toBeInTheDocument();
    });
  });

  it('display the information of Domain', async () => {
    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: serviceInfoDetail,
      isFetchingDomainResource: false,
    });

    render(<ServiceDetail />, { wrapper });

    // Check all tab declared in ServiceDetailTabsProps is present in dom
    ServiceDetailTabsProps.forEach((key) => {
      expect(screen.getByTestId(key.id)).toBeInTheDocument();
    });
  });
});

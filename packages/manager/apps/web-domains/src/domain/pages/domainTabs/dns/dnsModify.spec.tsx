import '@/common/setupTests';
import { render } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import React from 'react';
import {
  useGetDomainZone,
  useGetDomainResource,
} from '@/domain/hooks/data/query';
import { wrapper } from '@/common/utils/test.provider';
import DnsModifyPage from './dnsModify';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainZone: vi.fn(),
  useGetDomainResource: vi.fn(),
}));

vi.mock('@/domain/utils/dnsUtils', () => ({
  computeActiveConfiguration: vi.fn(),
}));

vi.mock('@/domain/components/ModifyNameServer/DnsConfigurationRadio', () => ({
  default: () => <div>Dns Configuration Radio Component</div>,
}));

describe('DnsModifyPage', () => {
  it('Render loading component when data is still fetching', () => {
    (useGetDomainZone as jest.Mock).mockReturnValue({
      domainZone: {},
      isFetchingdomainZone: true,
    });
    (useGetDomainResource as jest.Mock).mockReturnValue({
      domainResource: {},
      isFetchingDomainResource: true,
    });
    const { getByTestId } = render(<DnsModifyPage />, {
      wrapper,
    });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('Render DnsModify page', () => {
    (useGetDomainZone as jest.Mock).mockReturnValue({
      domainZone: {},
      isFetchingdomainZone: false,
    });
    (useGetDomainResource as jest.Mock).mockReturnValue({
      domainResource: {},
      isFetchingDomainResource: false,
    });
    const { getByTestId } = render(<DnsModifyPage />, {
      wrapper,
    });
    expect(getByTestId('modify-component')).toBeInTheDocument();
  });
});

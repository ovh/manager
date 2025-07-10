import '@/domain/setupTests';
import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import DomainTabDns from './domainTabDns';
import {
  dnsDatagridMock,
  dnsDatagridMockError,
} from '@/domain/__mocks__/dnsDetails';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';
import { wrapper } from '@/domain/utils/test.provider';
import { computeDnsDetails } from '@/domain/utils/utils';
import { useDomainDnsDatagridColumns } from '@/domain/hooks/domainTabs/useDomainDnsDatagridColumns';

vi.mock('@/domain/utils/utils', () => ({
  computeDnsDetails: vi.fn(),
}));

describe('DomainTabDnsWithError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (computeDnsDetails as jest.Mock).mockReturnValue(dnsDatagridMockError);
  });
  const { result } = renderHook(() => useDomainDnsDatagridColumns());
  const columns = result.current;
  it('should return the correct number of column', () => {
    expect(columns).toHaveLength(4);
  });

  it('should return the good labels', () => {
    const tests: Record<string, string> = {
      nameServer: 'domain_dns_table_header_serviceName',
      ip: 'domain_dns_table_header_ip',
      status: 'domain_dns_table_header_status',
      type: 'domain_dns_table_header_type',
    };

    Object.keys(tests).forEach((key) => {
      const dnsColumns = columns.find((col) => col.id === key);
      expect(dnsColumns).toBeDefined();
      expect(dnsColumns?.label).toBe(tests[key]);
    });
  });

  it('should display the content of DNS datagrid', () => {
    const { getByTestId, getAllByTestId } = render(
      <DomainTabDns domainResource={serviceInfoDetail} />,
      { wrapper },
    );
    expect(getByTestId('datagrid')).toBeInTheDocument();
    expect(getAllByTestId('status').length).toBe(4);
  });

  it('should show a warning message when a DNS has ERROR status', () => {
    const { getByText, container } = render(
      <DomainTabDns domainResource={serviceInfoDetail} />,
      { wrapper },
    );
    expect(getByText('domain_tab_DNS_error_warning')).toBeInTheDocument();
    const message = container.querySelector('[class*="Message"]');
    expect(message?.getAttribute('dismissible')).toBeFalsy();
  });

  it('should render DNS in the expected order', () => {
    (computeDnsDetails as jest.Mock).mockReturnValue(dnsDatagridMockError);

    const { getAllByTestId } = render(
      <DomainTabDns domainResource={serviceInfoDetail} />,
      { wrapper },
    );

    const nameCells = getAllByTestId('status');
    const expectedOrder = [
      'domain_dns_table_state_enabled',
      'domain_dns_table_state_error',
      'domain_dns_table_state_activating',
      'domain_dns_table_state_activating',
    ];

    const actualOrder = nameCells.map((cell) => cell.textContent);
    expect(actualOrder).toEqual(expectedOrder);
  });
});

describe('DomainTabDns', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (computeDnsDetails as jest.Mock).mockReturnValue(dnsDatagridMock);
  });

  it('should not render a warning message when no DNS has ERROR status', () => {
    const { queryByText } = render(
      <DomainTabDns domainResource={serviceInfoDetail} />,
      { wrapper },
    );
    expect(queryByText('domain_tab_DNS_error_warning')).not.toBeInTheDocument();
  });

  it('should render DNS in the expected order', () => {
    const { getAllByTestId } = render(
      <DomainTabDns domainResource={serviceInfoDetail} />,
      { wrapper },
    );

    const nameCells = getAllByTestId('status');
    const expectedOrder = [
      'domain_dns_table_state_enabled',
      'domain_dns_table_state_activating',
      'domain_dns_table_state_activating',
      'domain_dns_table_state_deleting',
    ];

    const actualOrder = nameCells.map((cell) => cell.textContent);
    expect(actualOrder).toEqual(expectedOrder);
  });
});

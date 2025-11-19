import '@/common/setupTests';
import { vi, describe, it, expect } from 'vitest';
import { render, renderHook, screen } from '@testing-library/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import HostsListing from './hostsListing';
import { wrapper } from '@/common/utils/test.provider';
import { useHostsDatagridColumns } from '@/domain/hooks/domainTabs/useHostsDatagridColumns';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';
import { nichandle } from '@/common/__mocks__/nichandle';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(() => ({
    domainResource: serviceInfoDetail,
  })),
}));

describe('Host Columns', () => {
  const { result } = renderHook(() => useHostsDatagridColumns());
  const columns = result.current;
  it('should return the correct number of column', () => {
    expect(columns).toHaveLength(4);
  });

  it('should return the good labels', () => {
    const tests: Record<string, string> = {
      host: 'domain_tab_hosts_listing_table_host',
      target: 'domain_tab_hosts_listing_table_target',
      status: `${NAMESPACES.STATUS}:status`,
    };

    Object.keys(tests).forEach((key) => {
      const dnsColumns = columns.find((col) => col.id === key);
      expect(dnsColumns).toBeDefined();
      expect(dnsColumns?.label).toBe(tests[key]);
    });
  });
});

describe('Host Datagrid', () => {
  it('should display the content of host datagrid', async () => {
    nichandle.auth.account = 'admin-id';
    render(<HostsListing />, {
      wrapper,
    });
    expect(await screen.findByTestId('datagrid')).toBeInTheDocument();
  });

  it('should display the warning message if nicadmin != user nic', async () => {
    nichandle.auth.account = 'adminxxx';
    render(<HostsListing />, {
      wrapper,
    });
    expect(await screen.findByTestId('warningMessage')).toBeInTheDocument();
  });
});

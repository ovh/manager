import '@/common/setupTests';
import { vi, describe, it, expect } from 'vitest';
import {
  fireEvent,
  render,
  renderHook,
  screen,
} from '@/common/utils/test.provider';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import HostsListing from './hostsListing';
import { wrapper } from '@/common/utils/test.provider';
import { useHostsDatagridColumns } from '@/domain/hooks/domainTabs/useHostsDatagridColumns';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';
import { nichandle } from '@/common/__mocks__/nichandle';

const hostsA11yRules = {
  'heading-order': { enabled: false },
  'empty-table-header': { enabled: false },
  'aria-prohibited-attr': { enabled: false },
};

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(() => ({
    domainResource: serviceInfoDetail,
  })),
  useUpdateDomainResource: vi.fn(() => ({
    updateDomain: vi.fn(),
    isUpdateDomainPending: false,
  })),
}));

describe('Host Columns', () => {
  const setDrawer = vi.fn();
  const setHostData = vi.fn();
  const { result } = renderHook(() =>
    useHostsDatagridColumns({ setDrawer, setHostData }),
  );
  const columns = result.current as Array<{
    id: string;
    label: string;
    [key: string]: any;
  }>;
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
    const { getByTestId, container } = render(<HostsListing />, {
      wrapper,
    });
    expect(await screen.findByTestId('datagrid')).toBeInTheDocument();

    const addButton = getByTestId('addButton');
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);

    const drawer = getByTestId('drawer');
    expect(drawer).toBeInTheDocument();

    await expect(container).toBeAccessible({ rules: hostsA11yRules });
  });

  it('should display the warning message if nicadmin != user nic', async () => {
    nichandle.auth.account = 'adminxxx';
    const { container } = render(<HostsListing />, {
      wrapper,
    });
    expect(await screen.findByTestId('warningMessage')).toBeInTheDocument();
    await expect(container).toBeAccessible({ rules: hostsA11yRules });
  });
});

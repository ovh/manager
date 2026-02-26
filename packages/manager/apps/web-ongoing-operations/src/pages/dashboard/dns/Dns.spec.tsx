import '@/setupTests';
import '@testing-library/jest-dom';
import { Mock, vi, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useFeatureAvailability, useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import { dns } from '@/__mocks__/dns';
import Dns from '@/pages/dashboard/dns/Dns';
import { allDomFeatureAvailibility, domainFeatureAvailibility, taskMeDns } from '@/constants';
import { serviceInfo } from '@/__mocks__/serviceInfo';
import { useGetDomainInformation } from '@/hooks/data/query';
import { wrapper } from '@/utils/test.provider';

const dnsA11yRules = {
  'select-name': { enabled: false },
  'aria-prohibited-attr': { enabled: false },
  'empty-table-header': { enabled: false },
  'button-name': { enabled: false },
  'label': { enabled: false },
  'aria-command-name': { enabled: false },
};

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(() => null),
  Navigate: vi.fn(() => null),
  useLocation: vi.fn(),
}));

vi.mock('@/data/api/web-ongoing-operations', () => ({
  getmeTaskDnsList: vi.fn(),
}));

vi.mock('@/hooks/data/query', () => ({
  useGetDomainInformation: vi.fn(),
}));

describe('Dns datagrid', () => {
  it('fetch in a good way using useResourcesIcebergV6',  async () => {
    (useFeatureAvailability as Mock).mockReturnValue({
          data: {[allDomFeatureAvailibility] : true, [domainFeatureAvailibility] : true}
        });
    (useResourcesIcebergV6 as Mock).mockReturnValue({
      flattenData: dns,
      isLoading: false,
      search: {
        searchInput: '',
        setSearchInput: vi.fn(),
        onSearch: vi.fn(),
      },
    });

    (useGetDomainInformation as Mock).mockReturnValue({
      data: serviceInfo,
    });

    const { container } = render(<Dns />, { wrapper });

    expect(useResourcesIcebergV6).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 10,
        route: `${taskMeDns.join('/')}`,
        disableCache: true,
        queryKey: taskMeDns,
      }),
    );
    await expect(container).toBeAccessible({ rules: dnsA11yRules });
  });

  it('Display the datagrid element', async () => {
    (useFeatureAvailability as Mock).mockReturnValue({
          data: {[allDomFeatureAvailibility] : true, [domainFeatureAvailibility] : true}
        });
    (useResourcesIcebergV6 as Mock).mockReturnValue({
      flattenData: dns,
      isLoading: false,
      search: {
        searchInput: '',
        setSearchInput: vi.fn(),
        onSearch: vi.fn(),
      },
    });

    (useGetDomainInformation as Mock).mockReturnValue({
      data: serviceInfo,
    });

    const { container } = render(<Dns />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      const dnsName = screen.getByTestId('testpuwebdomain.us');
      expect(dnsName).toBeInTheDocument();
      expect(dnsName).toHaveAttribute(
        'href',
        'https://ovh.test/#/web/domain/testpuwebdomain.us/information',
      );
    });
    await expect(container).toBeAccessible({ rules: dnsA11yRules });
  });

  it('Display the datagrid element but serviceInfo is undefined', async () => {
    (useFeatureAvailability as Mock).mockReturnValue({
          data: {[allDomFeatureAvailibility] : true, [domainFeatureAvailibility] : true}
        });
    (useResourcesIcebergV6 as Mock).mockReturnValue({
      flattenData: dns,
      isLoading: false,
      search: {
        searchInput: '',
        setSearchInput: vi.fn(),
        onSearch: vi.fn(),
      },
    });

    (useGetDomainInformation as Mock).mockReturnValue({
      data: undefined,
    });

    const { container } = render(<Dns />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      const dnsName = screen.getByTestId('testpuwebdomain.us');
      expect(dnsName).toBeInTheDocument();
      expect(dnsName).toHaveAttribute(
        'href',
        'https://ovh.test/#/web/zone/testpuwebdomain.us',
      );
    });
    await expect(container).toBeAccessible({ rules: dnsA11yRules });
  });
});

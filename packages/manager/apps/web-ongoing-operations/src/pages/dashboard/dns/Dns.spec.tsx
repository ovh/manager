import '@/setupTests';
import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import { dns } from '@/__mocks__/dns';
import Dns from '@/pages/dashboard/dns/Dns';
import { taskMeDns } from '@/constants';
import { serviceInfo } from '@/__mocks__/serviceInfo';
import { useGetDomainInformation } from '@/hooks/data/query';
import { wrapper } from '@/utils/test.provider';

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
  it('fetch in a good way using useResourcesIcebergV6', () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: dns,
      isLoading: false,
      search: {
        searchInput: '',
        setSearchInput: vi.fn(),
        onSearch: vi.fn(),
      },
    });

    (useGetDomainInformation as jest.Mock).mockReturnValue({
      data: serviceInfo,
    });

    render(<Dns />, { wrapper });

    expect(useResourcesIcebergV6).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 10,
        route: `${taskMeDns.join('/')}`,
        disableCache: false,
        queryKey: taskMeDns,
      }),
    );
  });

  it('Display the datagrid element', async () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: dns,
      isLoading: false,
      search: {
        searchInput: '',
        setSearchInput: vi.fn(),
        onSearch: vi.fn(),
      },
    });

    (useGetDomainInformation as jest.Mock).mockReturnValue({
      data: serviceInfo,
    });

    const { getByTestId } = render(<Dns />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('datagrid')).toBeInTheDocument();
      const dnsName = getByTestId('testpuwebdomain.us');
      expect(dnsName).toBeInTheDocument();
      expect(dnsName).toHaveAttribute(
        'href',
        'https://ovh.test/#/web/domain/testpuwebdomain.us/information',
      );
    });
  });

  it('Display the datagrid element but serviceInfo is undefined', async () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: dns,
      isLoading: false,
      search: {
        searchInput: '',
        setSearchInput: vi.fn(),
        onSearch: vi.fn(),
      },
    });

    (useGetDomainInformation as jest.Mock).mockReturnValue({
      data: undefined,
    });

    const { getByTestId } = render(<Dns />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('datagrid')).toBeInTheDocument();
      const dnsName = getByTestId('testpuwebdomain.us');
      expect(dnsName).toBeInTheDocument();
      expect(dnsName).toHaveAttribute(
        'href',
        'https://ovh.test/#/web/zone/testpuwebdomain.us',
      );
    });
  });
});

import '@/setupTests';
import React, { PropsWithChildren } from 'react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import { dns } from '@/__mocks__/dns';
import Dns from '@/pages/dashboard/dns/Dns';
import { taskMeDns } from '@/constants';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('@/data/api/web-ongoing-operations', () => ({
  getmeTaskDnsList: vi.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Dns datagrid', () => {
  it('displays loading spinner while main request are loading', async () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: [],
      isLoading: true,
    });
    const { getByTestId } = render(<Dns />, { wrapper });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('fetch in a good way using useResourcesIcebergV6', () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: dns,
      isLoading: false,
    });
    expect(useResourcesIcebergV6).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 30,
        route: taskMeDns,
      }),
    );
  });

  it('Display the datagrid element', async () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: dns,
      isLoading: false,
    });
    const { getByTestId } = render(<Dns />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('dns')).toBeInTheDocument();
      const dnsName = getByTestId('testpuwebdomain.us');
      expect(dnsName).toBeInTheDocument();
      expect(dnsName).toHaveAttribute(
        'href',
        'https://ovh.test/#/web/zone/testpuwebdomain.us',
      );
      expect(dnsName).toHaveAttribute('target', '_blank');
    });
  });
});

import '@/setupTests';
import React, { PropsWithChildren } from 'react';
import '@testing-library/jest-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { dns } from '@/__mocks__/dns';
import Dns from '@/pages/dashboard/dns/Dns';

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
    (useQuery as jest.Mock).mockReturnValue({ data: [], isLoading: true });
    const { getByTestId } = render(<Dns />, { wrapper });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('fetch in a good way using useQuery', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: dns,
      isLoading: false,
    });
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['dnsList'],
        queryFn: expect.any(Function),
      }),
    );
  });

  it('Display the datagrid element', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: dns,
      isLoading: false,
    });
    const { getByTestId } = render(<Dns />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('dns')).toBeInTheDocument();
      const dnsName = getByTestId('testpuwebdomain.us');
      expect(dnsName).toBeInTheDocument();
      expect(dnsName).toHaveAttribute(
        'href',
        'https://ovh.test/#/web/zone/testpuwebdomain.us/information',
      );
      expect(dnsName).toHaveAttribute('target', '_blank');
    });
  });
});

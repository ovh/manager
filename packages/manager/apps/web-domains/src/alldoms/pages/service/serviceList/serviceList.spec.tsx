import '@/alldoms/setupTests';
import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ServiceList from '@/alldoms/pages/service/serviceList/serviceList';
import { serviceInfoDetail } from '@/alldoms/__mocks__/serviceInfoDetail';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(() => null),
  Navigate: vi.fn(() => null),
  useLocation: vi.fn(() => ({
    pathname: '',
    search: '',
  })),
}));

vi.mock('@/alldoms/hooks/data/useDatagridServiceInfoList', () => ({
  useGetDatagridServiceInfoList: vi.fn(() => {
    return {
      serviceInfoList: serviceInfoDetail,
      isLoading: false,
    };
  }),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('AllDom datagrid', () => {
  it('displays loading spinner while main request are loading', async () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: [],
      isLoading: true,
    });

    const { getByTestId } = render(<ServiceList />, { wrapper });
    expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
  });

  it('display the datagrid data', async () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: serviceInfoDetail,
      isLoading: false,
    });
    const { getByTestId } = render(<ServiceList />, { wrapper });
    await waitFor(() => {
      expect(getByTestId('datagrid')).toBeInTheDocument();
    });
  });
});

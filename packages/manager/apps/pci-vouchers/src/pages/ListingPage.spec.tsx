import { render, waitFor } from '@testing-library/react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { describe, it, vi } from 'vitest';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { useHref, useParams } from 'react-router-dom';
import * as useVouchersModule from '@/api/hooks/useVouchers';
import ListingPage from './ListingPage';
import { TVoucher } from '@/interface';

vi.mock('@/api/hooks/useProject');

vi.mock('@ovh-ux/manager-react-components', () => ({
  useProjectUrl: vi.fn(),
  isDiscoveryProject: vi.fn(),
  useDatagridSearchParams: vi.fn().mockReturnValue({
    pagination: {},
  }),
  PciGuidesHeader: vi.fn().mockReturnValue(<div></div>),
  Notifications: vi.fn().mockReturnValue(<div></div>),
  Datagrid: vi.fn().mockReturnValue(<div>Datagrid</div>),
  PciDiscoveryBanner: vi.fn().mockReturnValue(<div>Discovery</div>),
}));

vi.mock('@/api/hooks/useVouchers', () => ({
  useVouchers: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useHref: vi.fn(),
  useParams: vi.fn(),
  Outlet: vi.fn().mockReturnValue(<div></div>),
}));

type TPaginatedVoucher = {
  isLoading: boolean;
  error: Error;
  data: { rows: TVoucher[]; pageCount: number; totalRows: number };
};

const shellContext = {
  environment: {
    getUser: vi.fn().mockReturnValue({
      ovhSubsidiary: 'foo',
      currency: {
        symbol: '€',
      },
    }),
  },
  shell: {
    navigation: {
      getURL: vi.fn(),
    },
  },
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

describe('ListingPage', () => {
  // render loading spinner when vouchers are loading
  it('should render loading spinner when vouchers are loading', async () => {
    vi.mocked(useProjectUrl).mockReturnValue(
      'public-cloud/project/projectid123',
    );
    vi.spyOn(useVouchersModule, 'useVouchers').mockReturnValue({
      isLoading: true,
    } as TPaginatedVoucher);

    vi.mocked(useHref)
      .mockReturnValueOnce('./mockAdd')
      .mockReturnValueOnce('./mockCredit');

    vi.mocked(useParams).mockReturnValue({ projectId: 'projectid123' });

    const { getByTestId } = render(<ListingPage />, { wrapper });

    await waitFor(() => {
      expect(getByTestId('ListingPage-spinner')).toBeInTheDocument();
    });
  });

  // render error message when vouchers are failed to load
  it('should render error message when vouchers are failed to load', async () => {
    vi.mocked(useProjectUrl).mockReturnValue(
      'public-cloud/project/projectid123',
    );
    vi.spyOn(useVouchersModule, 'useVouchers').mockReturnValue({
      error: new Error('Failed to load vouchers'),
    } as TPaginatedVoucher);

    vi.mocked(useHref)
      .mockReturnValueOnce('./mockAdd')
      .mockReturnValueOnce('./mockCredit');

    vi.mocked(useParams).mockReturnValue({ projectId: 'projectid123' });

    const { getByText } = render(<ListingPage />, { wrapper });

    await waitFor(() => {
      expect(getByText('manager_error_page_default')).toBeInTheDocument();
    });
  });
  // render vouchers when vouchers are loaded
  it('should render vouchers when vouchers are loaded', async () => {
    vi.mocked(useProjectUrl).mockReturnValue(
      'public-cloud/project/projectid123',
    );
    vi.spyOn(useVouchersModule, 'useVouchers').mockReturnValue({
      data: {
        rows: ([
          {
            id: 'voucherid123',
            code: 'Voucher Code',
            amount: 100,
            currency: 'EUR',
          },
        ] as unknown) as TVoucher[],
      },
      isLoading: false,
      error: null,
    } as TPaginatedVoucher);

    vi.mocked(useHref)
      .mockReturnValueOnce('./mockAdd')
      .mockReturnValueOnce('./mockCredit');

    vi.mocked(useParams).mockReturnValue({ projectId: 'projectid123' });

    const { getByText } = render(<ListingPage />, { wrapper });

    await waitFor(() => {
      expect(getByText('Datagrid')).toBeInTheDocument();
    });
  });
});

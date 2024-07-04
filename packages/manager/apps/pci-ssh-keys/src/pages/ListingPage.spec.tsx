import { render, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { TProject } from '@ovh-ux/manager-pci-common';
import ListingPage from './ListingPage';
import * as useSShModule from '@/api/hooks/useSsh';
import { TSshKey } from '@/interface';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useProjectUrl: vi.fn(),
  isDiscoveryProject: vi.fn(),
  useDatagridSearchParams: vi.fn().mockReturnValue({
    pagination: {},
    sorting: {},
  }),
  PciGuidesHeader: vi.fn().mockReturnValue(<div></div>),
  Notifications: vi.fn().mockReturnValue(<div>Notifications</div>),
  Datagrid: vi.fn().mockReturnValue(<div>Datagrid</div>),
  PciDiscoveryBanner: vi.fn().mockReturnValue(<div>Discovery</div>),
}));

vi.mock('@/api/hooks/useSsh');
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  Outlet: vi.fn().mockReturnValue(<div></div>),
  useNavigate: vi.fn(),
  useRouteLoaderData: vi.fn().mockReturnValue({
    description: 'foo',
  } as TProject),
}));

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
    tracking: {
      trackClick: vi.fn(),
    },
  },
};

type TPaginatedSshKey = {
  isLoading: boolean;
  error: Error;
  data: { rows: TSshKey[]; pageCount: number; totalRows: number };
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
  it('displays loading spinner while SSH keys are loading', () => {
    vi.mocked(useParams).mockReturnValue({ projectId: 'foo' });
    vi.spyOn(useSShModule, 'useSshKeys').mockReturnValue({
      isLoading: true,
    } as TPaginatedSshKey);
    const { getByTestId } = render(<ListingPage />, { wrapper });

    expect(getByTestId('ListingPage-spinner')).toBeInTheDocument();
  });

  it('displays SSH keys once loaded', async () => {
    vi.spyOn(useSShModule, 'useSshKeys').mockReturnValue({
      isLoading: false,
      data: {
        rows: [{ id: '1', name: 'Key 1', publicKey: 'ssh-rsa AAA...' }],
        totalRows: 1,
      },
    } as TPaginatedSshKey);
    const { getByText } = render(<ListingPage />, { wrapper });

    await waitFor(() => expect(getByText('Datagrid')).toBeInTheDocument());
  });
});

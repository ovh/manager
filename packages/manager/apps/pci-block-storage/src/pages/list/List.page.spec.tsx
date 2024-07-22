import { render, waitFor } from '@testing-library/react';
/* import {
  PublicCloudProject,
  useProductMaintenance,
  useProject,
} from '@ovh-ux/manager-react-components'; */
import * as managerComponentsModule from '@ovh-ux/manager-react-components';
import { Datagrid } from '@ovh-ux/manager-react-components';
import * as pciCommonModule from '@ovh-ux/manager-pci-common';
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
import { TProject } from '@ovh-ux/manager-pci-common';
import * as useVolumeModule from '@/api/hooks/useVolume';
import ListingPage from './List.page';
import * as useAnnouncementBannerModule from '@/hooks/useAnnouncementBanner';
import { TVolume } from '@/api/data/volume';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn().mockReturnValue(() => ''),
  useParams: vi.fn().mockReturnValue({}),
  Outlet: vi.fn().mockReturnValue(<div></div>),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useProject: vi.fn(),
  useAnnouncementBanner: vi.fn(),
  useProductMaintenance: vi.fn(),
  isDiscoveryProject: vi.fn(),
  PciGuidesHeader: vi.fn().mockReturnValue(<div></div>),
  PciAnnouncementBanner: vi.fn().mockReturnValue(<div></div>),
  PciMaintenanceBanner: vi
    .fn()
    .mockReturnValue(<div>Product is under maintenance</div>),
  FilterAdd: vi.fn().mockReturnValue(<div></div>),
  FilterList: vi.fn().mockReturnValue(<div></div>),
  Headers: vi.fn().mockReturnValue(<div></div>),
  Datagrid: vi.fn(),
  Notifications: vi.fn().mockReturnValue(<div></div>),
  useColumnFilters: vi.fn().mockReturnValue({
    filters: [],
  }),
  useDataGrid: vi.fn().mockReturnValue({}),
  useNotifications: vi.fn().mockReturnValue({
    clearNotifications: vi.fn(),
  }),
  RedirectionGuard: vi.fn().mockReturnValue(<div></div>),
}));

vi.mock('@/api/hooks/useVolume', () => ({
  useAllVolumes: vi.fn(),
  useVolumes: vi.fn(),
}));

const shellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'spyOn_ovhSubsidiary' }),
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

type TVolumePaginated = {
  data: { rows: TVolume[]; pageCount: number; totalRows: number };
  isLoading: boolean;
  isPending: boolean;
  error: Error;
};

const { shell } = shellContext;
shell.navigation.getURL.mockResolvedValue('https://www.ovh.com');
vi.spyOn(pciCommonModule, 'useProject').mockReturnValue({
  data: { description: 'Project 1' },
  isLoading: false,
  isPending: false,
} as UseQueryResult<TProject, null>);

describe('ListingPage', () => {
  it('renders maintenance banner when product has maintenance', async () => {
    vi.spyOn(managerComponentsModule, 'useProductMaintenance').mockReturnValue({
      hasMaintenance: true,
      maintenanceURL: 'http://maintenance.com',
    });
    vi.spyOn(
      useAnnouncementBannerModule,
      'useAnnouncementBanner',
    ).mockReturnValue({
      isBannerVisible: false,
      isLoading: false,
    });
    vi.spyOn(useVolumeModule, 'useAllVolumes').mockReturnValue({
      data: [],
      isLoading: false,
      isPending: false,
    } as UseQueryResult<TVolume[]>);
    vi.spyOn(useVolumeModule, 'useVolumes').mockReturnValue({
      data: { rows: [] },
      isLoading: false,
      isPending: false,
    } as TVolumePaginated);

    const { getByTestId } = render(<ListingPage />, {
      wrapper,
    });
    waitFor(() =>
      expect(getByTestId('ListPage_maintenance-banner')).toBeInTheDocument(),
    );
  });

  it('renders announcement banner when banner is visible', async () => {
    vi.spyOn(managerComponentsModule, 'useProductMaintenance').mockReturnValue({
      hasMaintenance: false,
      maintenanceURL: '',
    });
    vi.spyOn(
      useAnnouncementBannerModule,
      'useAnnouncementBanner',
    ).mockReturnValue({ isBannerVisible: true, isLoading: false });
    vi.spyOn(useVolumeModule, 'useAllVolumes').mockReturnValue({
      data: [],
      isLoading: false,
      isPending: false,
    } as UseQueryResult<TVolume[]>);
    vi.spyOn(useVolumeModule, 'useVolumes').mockReturnValue({
      data: { rows: [] },
      isLoading: false,
      isPending: false,
    } as TVolumePaginated);

    const { getByTestId } = render(<ListingPage />, { wrapper });
    waitFor(() =>
      expect(getByTestId('ListPage_announcementBanner')).toBeInTheDocument(),
    );
  });

  it('renders volumes when volumes are available', async () => {
    vi.spyOn(managerComponentsModule, 'useProductMaintenance').mockReturnValue({
      hasMaintenance: false,
      maintenanceURL: '',
    });
    vi.spyOn(
      useAnnouncementBannerModule,
      'useAnnouncementBanner',
    ).mockReturnValue({
      isBannerVisible: false,
      isLoading: false,
    });
    vi.spyOn(useVolumeModule, 'useAllVolumes').mockReturnValue({
      data: [],
      isLoading: false,
      isPending: false,
    } as UseQueryResult<TVolume[]>);
    vi.spyOn(useVolumeModule, 'useVolumes').mockReturnValue({
      data: { rows: [{ id: '1', name: 'Volume 1' }] },
      isLoading: false,
      isPending: false,
    } as TVolumePaginated);
    vi.mocked(Datagrid).mockReturnValue(<div></div>);

    const { getByText } = render(<ListingPage />, {
      wrapper,
    });
    waitFor(() => expect(getByText('Volume 1')).toBeInTheDocument());
  });
});

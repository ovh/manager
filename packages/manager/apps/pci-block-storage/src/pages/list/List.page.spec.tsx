import { render, waitFor } from '@testing-library/react';
import * as managerComponentsModule from '@ovh-ux/manager-react-components';
import { describe, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import ListingPage from './List.page';
import * as useAnnouncementBannerModule from '../../../../../modules/manager-pci-common/src/components/banner/announcement-banner/useAnnouncementBanner.hook';

vi.mock('react-i18next', async (importOrig) => {
  const orig = await importOrig<typeof import('react-i18next')>();
  return {
    ...orig,
    useTranslation: () => ({
      ...orig.useTranslation(),
      i18n: {
        exists: () => true,
      },
    }),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useHref: vi.fn(),
    Navigate: vi.fn(),
    useNavigate: vi.fn().mockReturnValue(() => ''),
    useParams: vi.fn(() => ({ projectId: '1' })),
    Outlet: vi.fn().mockReturnValue(<div></div>),
    Suspense: vi.fn().mockReturnValue(<div></div>),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigation: vi.fn(() => ({
      navigateTo: vi.fn(),
    })),
  };
});

vi.mock('@/core/HidePreloader');

vi.mock('@ovh-ux/manager-pci-common', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useProject: vi.fn(() => ({
      data: { description: 'Project 1' },
      isLoading: false,
      isPending: false,
    })),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    isDiscoveryProject: vi.fn(),
    PciGuidesHeader: vi.fn().mockReturnValue(<div></div>),
    FilterAdd: vi.fn().mockReturnValue(<div></div>),
    FilterList: vi.fn().mockReturnValue(<div></div>),
    Headers: vi.fn().mockReturnValue(<div></div>),
    Notifications: vi.fn().mockReturnValue(<div></div>),
    useNotifications: vi.fn(() => ({
      clearNotifications: vi.fn(),
    })),
  };
});

vi.mock('@/api/hooks/useVolume', () => ({
  useAllVolumes: vi.fn(() => ({
    data: [
      {
        id: '1',
        name: 'Volume 1 for datagrid render',
        attachedTo: [],
        creationDate: '',
        description: '',
        size: 0,
        status: 'available',
        statusGroup: '',
        region: 'region',
        bootable: false,
        planCode: '',
        type: '',
        regionName: '',
      },
    ],
    isFetching: false,
    isPending: false,
  })),
  useVolumes: vi.fn(() => ({
    data: {
      rows: [
        {
          id: '1',
          name: 'Volume 1 for datagrid render',
          attachedTo: [],
          creationDate: '',
          description: '',
          size: 0,
          status: 'available',
          statusGroup: '',
          region: 'region',
          bootable: false,
          planCode: '',
          type: '',
          regionName: '',
        },
      ],
      pageCount: 1,
      totalRows: 1,
    },
    isLoading: false,
    isPending: false,
  })),
}));

const shellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'spyOn_ovhSubsidiary' }),
  },
  shell: {
    navigation: {
      getURL: () => Promise.resolve('https://www.ovh.com'),
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

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ListingPage', () => {
  it('renders maintenance banner when product has maintenance', async () => {
    vi.spyOn(managerComponentsModule, 'useProductMaintenance').mockReturnValue({
      hasMaintenance: true,
      maintenanceURL: 'http://maintenance.com',
    });

    const { getByTestId } = render(<ListingPage />, {
      wrapper,
    });
    await waitFor(() =>
      expect(getByTestId('maintenance-banner')).toBeInTheDocument(),
    );
  });

  it('renders announcement banner when banner is visible', async () => {
    vi.spyOn(
      useAnnouncementBannerModule,
      'useAnnouncementBanner',
    ).mockReturnValue({
      isBannerVisible: true,
      isLoading: false,
    });

    const { getByTestId } = render(<ListingPage />, { wrapper });
    await waitFor(() =>
      expect(getByTestId('actionBanner-message_container')).toBeInTheDocument(),
    );
  });

  it('renders volumes when volumes are available', async () => {
    const { getByText } = render(<ListingPage />, {
      wrapper,
    });

    await waitFor(() =>
      expect(getByText('Volume 1 for datagrid render')).toBeInTheDocument(),
    );
  });
});

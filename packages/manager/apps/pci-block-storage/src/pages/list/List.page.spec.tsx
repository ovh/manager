import { waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import ListingPage from './List.page';
import { renderWithMockedWrappers } from '@/__tests__/renderWithMockedWrappers';

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigation: vi.fn(() => ({
      navigateTo: vi.fn(),
    })),
  };
});

vi.mock('react-router-dom');

vi.mock('@ovh-ux/manager-pci-common', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useProject: vi.fn(() => ({
      data: { description: 'Project 1' },
      isLoading: false,
      isPending: false,
    })),
    PciAnnouncementBanner: () => <div>announcement_banner</div>,
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

afterEach(() => {
  vi.clearAllMocks();
});

describe('ListingPage', () => {
  it('renders volumes when volumes are available', async () => {
    const { getByText } = renderWithMockedWrappers(<ListingPage />);

    await waitFor(() =>
      expect(getByText('Volume 1 for datagrid render')).toBeInTheDocument(),
    );
  });
});

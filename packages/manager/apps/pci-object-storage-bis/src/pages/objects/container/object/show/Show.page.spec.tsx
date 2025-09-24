import { describe, vi, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  useParams,
  useSearchParams,
  useHref,
  MemoryRouter,
} from 'react-router-dom';
import {
  useProductMaintenance,
  useMe,
  IMe,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useProject, TProject } from '@ovh-ux/manager-pci-common';

import { UseQueryResult } from '@tanstack/react-query';
import ShowPage from './Show.page';
import { useContainerData } from '@/hooks/useContainerData';
import { wrapper } from '@/wrapperRenders';
import { TRegion } from '@/api/data/region';
import { TContainer } from '@/pages/dashboard/BucketPropertiesCard';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    Outlet: vi.fn(() => <div>Outlet</div>),
    useParams: vi.fn(),
    useSearchParams: vi.fn(),
    useHref: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return {
    ...actual,
    useProductMaintenance: vi.fn(),
    useMe: vi.fn(),
    useProjectUrl: vi.fn(),
    useNotifications: vi.fn(() => ({
      clearNotifications: vi.fn(),
    })),
    PciMaintenanceBanner: vi.fn(() => (
      <div data-testid="maintenance-banner">
        <a
          data-testid="pci-maintenance-banner-link"
          href="https://status.ovh.com"
        >
          Maintenance
        </a>
      </div>
    )),
    BaseLayout: vi.fn(({ children }) => <div>{children}</div>),
    Notifications: vi.fn(() => <div>Notifications</div>),
    TabsPanel: vi.fn(() => <div>Tabs</div>),
    Datagrid: vi.fn(() => <div>Mocked Datagrid</div>),
    FilterAdd: vi.fn(() => <div>Mocked FilterAdd</div>),
    Filters: vi.fn(() => <div>Mocked Filters</div>),
  };
});

vi.mock('@ovh-ux/manager-pci-common', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-pci-common')
  >();
  return {
    ...actual,
    useProject: vi.fn(),

    TabsPanel: vi.fn(() => <div>Mocked TabsPanel</div>),
    Tabs: vi.fn(() => <div>Mocked Tabs</div>),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async () => ({
  ...(await vi.importActual('@ovh-ux/manager-react-shell-client')),
  useOvhTracking: vi.fn().mockReturnValue({
    trackPage: vi.fn(),
    trackClick: vi.fn(),
  }),
}));

vi.mock('@/hooks/useContainerData', () => ({
  useContainerData: vi.fn(),
}));

describe('ShowPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useParams).mockReturnValue({
      storageId: 'container-id',
      projectId: 'project-id',
    });
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams('region=GRA'),
      vi.fn(),
    ]);
    vi.mocked(useHref).mockReturnValue('/test');
    vi.mocked(useProjectUrl).mockReturnValue('/project-url');
    vi.mocked(useProductMaintenance).mockReturnValue({
      hasMaintenance: false,
      maintenanceURL: '',
    });
    vi.mocked(useMe).mockReturnValue({ me: { ovhSubsidiary: 'FR' } as IMe });
    vi.mocked(useProject).mockReturnValue({
      data: { project_id: 'project-id', description: 'Test Project' },
    } as UseQueryResult<TProject, null>);
    vi.mocked(useContainerData).mockReturnValue({
      container: {
        id: 'container-id',
        name: 'test-container',
        versioning: { status: 'ENABLED' },
        objectLock: { status: 'DISABLED' },
        region: 'GRA',
      } as TContainer,
      url: 'https://test.com',
      region: { name: 'GRA' } as TRegion,
      isEncrypted: false,
      showReplicationBanner: false,
      showEnableEncryptionLink: false,
      displayEncryptionData: false,
      isPending: false,
      isLocalZone: false,
      isRightOffer: true,
    });
  });

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, {
      wrapper: ({ children }) => (
        <MemoryRouter>{wrapper({ children })}</MemoryRouter>
      ),
    });
  };

  it('should render loading spinner when data is pending', () => {
    vi.mocked(useContainerData).mockReturnValueOnce({
      container: null,
      url: '',
      region: null,
      isEncrypted: false,
      showReplicationBanner: false,
      showEnableEncryptionLink: false,
      displayEncryptionData: false,
      isPending: true,
      isLocalZone: false,
      isRightOffer: true,
    });

    renderWithRouter(<ShowPage />);
    const spinner = document.querySelector('ods-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('size', 'md');
  });

  it('should render maintenance banner when active', () => {
    vi.mocked(useProductMaintenance).mockReturnValueOnce({
      hasMaintenance: true,
      maintenanceURL: 'https://status.ovh.com',
    });

    renderWithRouter(<ShowPage />);
    const banner = screen.getByTestId('maintenance-banner');
    expect(banner).toBeInTheDocument();

    const link = screen.getByTestId('pci-maintenance-banner-link');
    expect(link).toHaveAttribute('href', 'https://status.ovh.com');
  });
});

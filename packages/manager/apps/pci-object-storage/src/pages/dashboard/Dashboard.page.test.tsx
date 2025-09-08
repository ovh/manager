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
import DashboardPage from './Dashboard.page';
import { useContainerData } from '@/hooks/useContainerData';
import { wrapper } from '@/wrapperRenders';
import { TRegion } from '@/api/data/region';
import { TContainer } from './BucketPropertiesCard';

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
    PciGuidesHeader: vi.fn(() => <div data-testid="guides-header" />),
    Notifications: vi.fn(() => <div data-testid="notifications" />),
  };
});

vi.mock('@ovh-ux/manager-pci-common', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-pci-common')
  >();
  return {
    ...actual,
    useProject: vi.fn(),
    TabsPanel: vi.fn(({ tabs }) => (
      <div data-testid="tabs-panel">{tabs.map((tab) => tab.label)}</div>
    )),
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
  useContainerData: vi.fn(() => ({
    container: {
      id: 'container-id',
      name: 'test-container',
      versioning: { status: 'ENABLED' },
      objectLock: { status: 'DISABLED' },
      region: 'GRA',
    },
    url: 'https://test.com',
    region: { name: 'GRA' },
    isEncrypted: false,
    showReplicationBanner: false,
    showEnableEncryptionLink: false,
    displayEncryptionData: false,
    isPending: false,
    isLocalZone: false,
    isRightOffer: true,
  })),
}));

describe('DashboardPage', () => {
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

    renderWithRouter(<DashboardPage />);
    const spinner = document.querySelector('ods-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('size', 'md');
  });

  it('should render the main layout with breadcrumb', () => {
    renderWithRouter(<DashboardPage />);

    const breadcrumbItem = document.querySelector(
      'ods-breadcrumb-item[label="Test Project"]',
    );
    expect(breadcrumbItem).toBeInTheDocument();

    const containerBreadcrumb = document.querySelector(
      'ods-breadcrumb-item[label="test-container"]',
    );
    expect(containerBreadcrumb).toBeInTheDocument();
  });

  it('should render all cards when data is loaded', () => {
    renderWithRouter(<DashboardPage />);

    const cardTitles = Array.from(
      document.querySelectorAll('ods-text[preset="heading-4"]'),
    ).map((el) => el.textContent);

    expect(cardTitles).toContain(
      'dashboard:pci_projects_project_storages_dashboard_informations',
    );
    expect(cardTitles).toContain(
      'dashboard:pci_projects_project_storages_dashboard_bucket_properties',
    );
    expect(cardTitles).toContain(
      'dashboard:pci_projects_project_storages_dashboard_storage_management',
    );
  });

  it('should show maintenance banner when maintenance is active', () => {
    vi.mocked(useProductMaintenance).mockReturnValueOnce({
      hasMaintenance: true,
      maintenanceURL: 'https://maintenance.example.com',
    });

    renderWithRouter(<DashboardPage />);

    const maintenanceBanner = screen.getByTestId('maintenance-banner');
    expect(maintenanceBanner).toBeInTheDocument();

    const maintenanceLink = screen.getByTestId('pci-maintenance-banner-link');
    expect(maintenanceLink).toHaveAttribute(
      'href',
      'https://maintenance.example.com',
    );
  });

  it('should call useProjectUrl with correct arguments', () => {
    renderWithRouter(<DashboardPage />);
    expect(useProjectUrl).toHaveBeenCalledWith('public-cloud');
  });
});

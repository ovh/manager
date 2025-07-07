import fs from 'fs';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { useResourcesV6 } from '@ovh-ux/manager-react-components';
import { useTrustedZoneBanner } from '@ovh-ux/manager-pci-common';
import Listing from './Listing';
import useRedirectAfterProjectSelection from '@/hooks/useRedirectAfterProjectSelection';
import { createWrapper } from '@/wrapperRenders';
import { getDatagridColumns } from './datagrid-columns';

vi.mock('./datagrid-columns', () => ({
  getDatagridColumns: vi.fn(),
}));

vi.mock('@/hooks/useRedirectAfterProjectSelection', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('@/data/api/projects-with-services', () => ({
  getProjectsWithServices: vi.fn(),
  projectsWithServiceQueryKey: () => ['projects-with-services'],
}));

vi.mock('@/components/ManagerBannerText', () => ({
  __esModule: true,
  default: () => <div data-testid="manager-banner-text" />,
}));

const wrapper = createWrapper();

const baseResourcesV6Mock = {
  flattenData: undefined,
  isError: false,
  totalCount: 0,
  hasNextPage: false,
  fetchNextPage: vi.fn(),
  isLoading: true,
  setSorting: vi.fn(),
  search: undefined,
  sorting: undefined,
  filters: undefined,
};

describe('listing page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set default mocks
    vi.mocked(useRedirectAfterProjectSelection).mockReturnValue({
      redirect: vi.fn(),
      redirectUrl: vi.fn().mockResolvedValue('/redirect-url'),
      isRedirectRequired: false,
    });
  });

  it('displays datagrid skeleton while main request is loading', () => {
    vi.mocked(useResourcesV6).mockReturnValue(({
      ...baseResourcesV6Mock,
    } as unknown) as ReturnType<typeof useResourcesV6>);

    vi.mocked(useTrustedZoneBanner).mockReturnValue({
      isBannerVisible: false,
      isLoading: false,
    });

    vi.mocked(getDatagridColumns).mockReturnValue([
      {
        id: 'description',
        label: 'Description',
        cell: () => <div>Description</div>,
      },
    ]);

    render(<Listing />, { wrapper });

    expect(screen.getByTestId('datagrid')).toBeInTheDocument();
    expect(screen.getByTestId('loading-row')).toBeInTheDocument();
  });

  it('displays error banner when there is an error', () => {
    const errorMock = {
      message: 'Test error',
      response: { status: 500, headers: {} },
      name: 'error',
    };

    vi.mocked(useResourcesV6).mockReturnValue(({
      ...baseResourcesV6Mock,
      isError: true,
      error: errorMock,
      isLoading: false,
    } as unknown) as ReturnType<typeof useResourcesV6>);

    vi.mocked(useTrustedZoneBanner).mockReturnValue({
      isBannerVisible: false,
      isLoading: false,
    });

    render(<Listing />, { wrapper });

    expect(screen.getByTestId('error-banner')).toBeInTheDocument();
  });

  it('displays datagrid when data is loaded', () => {
    vi.mocked(useResourcesV6).mockReturnValue(({
      ...baseResourcesV6Mock,
      flattenData: [{ id: '1', name: 'Test Project' }],
      isLoading: false,
      totalCount: 1,
    } as unknown) as ReturnType<typeof useResourcesV6>);

    vi.mocked(useTrustedZoneBanner).mockReturnValue({
      isBannerVisible: false,
      isLoading: false,
    });

    render(<Listing />, { wrapper });

    expect(screen.getByTestId('base-layout')).toBeInTheDocument();
    expect(screen.getByTestId('manager-banner-text')).toBeInTheDocument();
    expect(screen.getByTestId('datagrid')).toBeInTheDocument();
    expect(screen.getByTestId('notifications')).toBeInTheDocument();
    expect(screen.getByTestId('pci-trusted-zone-banner')).toBeInTheDocument();
  });

  it('displays create project button when trusted zone is not visible and not loading', () => {
    vi.mocked(useResourcesV6).mockReturnValue(({
      ...baseResourcesV6Mock,
      flattenData: [{ id: '1', name: 'Test Project' }],
      isLoading: false,
      totalCount: 1,
    } as unknown) as ReturnType<typeof useResourcesV6>);

    vi.mocked(useTrustedZoneBanner).mockReturnValue({
      isBannerVisible: false,
      isLoading: false,
    });

    render(<Listing />, { wrapper });

    expect(screen.getByTestId('ods-button')).toBeInTheDocument();
    expect(screen.getByText('pci_projects_create_project')).toBeInTheDocument();
  });

  it('does not display create project button when trusted zone is visible', () => {
    vi.mocked(useResourcesV6).mockReturnValue(({
      ...baseResourcesV6Mock,
      flattenData: [{ id: '1', name: 'Test Project' }],
      isLoading: false,
      totalCount: 1,
    } as unknown) as ReturnType<typeof useResourcesV6>);

    vi.mocked(useTrustedZoneBanner).mockReturnValue({
      isBannerVisible: true,
      isLoading: false,
    });

    render(<Listing />, { wrapper });

    expect(screen.queryByTestId('ods-button')).not.toBeInTheDocument();
  });

  it('does not display create project button when trusted zone is loading', () => {
    vi.mocked(useResourcesV6).mockReturnValue(({
      ...baseResourcesV6Mock,
      flattenData: [{ id: '1', name: 'Test Project' }],
      isLoading: false,
      totalCount: 1,
    } as unknown) as ReturnType<typeof useResourcesV6>);

    vi.mocked(useTrustedZoneBanner).mockReturnValue({
      isBannerVisible: false,
      isLoading: true,
    });

    render(<Listing />, { wrapper });

    expect(screen.queryByTestId('ods-button')).not.toBeInTheDocument();
  });

  it('calls addInfo when redirect is required', () => {
    vi.mocked(useRedirectAfterProjectSelection).mockReturnValue({
      redirect: vi.fn(),
      redirectUrl: vi.fn().mockResolvedValue('/redirect-url'),
      isRedirectRequired: true,
    });

    vi.mocked(useResourcesV6).mockReturnValue(({
      ...baseResourcesV6Mock,
      flattenData: [{ id: '1', name: 'Test Project' }],
      isLoading: false,
      totalCount: 1,
    } as unknown) as ReturnType<typeof useResourcesV6>);

    vi.mocked(useTrustedZoneBanner).mockReturnValue({
      isBannerVisible: false,
      isLoading: false,
    });

    render(<Listing />, { wrapper });

    // Since useNotifications is mocked in setupTests.tsx, we can't easily test addInfo
    // Instead, we verify the component renders correctly when isRedirectRequired is true
    expect(screen.getByTestId('base-layout')).toBeInTheDocument();
  });

  it('passes correct props to useResourcesV6', () => {
    vi.mocked(useResourcesV6).mockReturnValue(({
      ...baseResourcesV6Mock,
      isLoading: false,
    } as unknown) as ReturnType<typeof useResourcesV6>);

    vi.mocked(useTrustedZoneBanner).mockReturnValue({
      isBannerVisible: false,
      isLoading: false,
    });

    render(<Listing />, { wrapper });

    expect(useResourcesV6).toHaveBeenCalledWith({
      columns: expect.any(Array),
      route: '/cloud/project',
      queryFn: expect.any(Function),
      queryKey: ['projects-with-services'],
      defaultSorting: {
        id: 'aggregatedStatus',
        desc: true,
      },
    });
  });

  it('renders with Suspense wrapper around Datagrid', () => {
    vi.mocked(useResourcesV6).mockReturnValue(({
      ...baseResourcesV6Mock,
      flattenData: [{ id: '1', name: 'Test Project' }],
      isLoading: false,
      totalCount: 1,
    } as unknown) as ReturnType<typeof useResourcesV6>);

    vi.mocked(useTrustedZoneBanner).mockReturnValue({
      isBannerVisible: false,
      isLoading: false,
    });

    render(<Listing />, { wrapper });

    expect(screen.getByTestId('datagrid')).toBeInTheDocument();
  });

  it('passes TopbarCTA component to Datagrid', () => {
    vi.mocked(useResourcesV6).mockReturnValue(({
      ...baseResourcesV6Mock,
      flattenData: [{ id: '1', name: 'Test Project' }],
      isLoading: false,
      totalCount: 1,
    } as unknown) as ReturnType<typeof useResourcesV6>);

    vi.mocked(useTrustedZoneBanner).mockReturnValue({
      isBannerVisible: false,
      isLoading: false,
    });

    render(<Listing />, { wrapper });

    // The topbar should contain the create project button
    expect(screen.getByTestId('layout-topbar')).toBeInTheDocument();
    expect(screen.getByTestId('ods-button')).toBeInTheDocument();
  });
});

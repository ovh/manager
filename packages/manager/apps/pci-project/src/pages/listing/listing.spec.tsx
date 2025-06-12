import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { useResourcesV6 } from '@ovh-ux/manager-react-components';
import { useTrustedZoneBanner } from '@ovh-ux/manager-pci-common';
import Listing from './Listing';
import queryClient from '@/queryClient';

vi.mock('./datagrid-columns', () => ({
  getDatagridColumns: () => [
    { id: 'name', label: 'Name' },
    { id: 'status', label: 'Status' },
  ],
}));

vi.mock('@/data/api/projects-with-services', () => ({
  getProjectsWithServices: vi.fn(),
  projectsWithServiceQueryKey: () => ['projects-with-services'],
}));

vi.mock('@/components/ManagerBannerText', () => ({
  __esModule: true,
  default: () => <div data-testid="manager-banner-text" />,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('listing page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading spinner while main request are loading', () => {
    vi.mocked(useResourcesV6).mockReturnValue(({
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
    } as unknown) as ReturnType<typeof useResourcesV6>);

    vi.mocked(useTrustedZoneBanner).mockReturnValue({
      isBannerVisible: false,
      isLoading: false,
    });

    render(<Listing />, { wrapper });

    expect(screen.getByTestId('listing-spinner-container')).toBeInTheDocument();
    expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
  });

  it('displays error banner when there is an error', () => {
    const errorMock = {
      message: 'Test error',
      response: { status: 500, headers: {} },
      name: 'error',
    };

    vi.mocked(useResourcesV6).mockReturnValue(({
      flattenData: undefined,
      isError: true,
      error: errorMock,
      totalCount: 0,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      setSorting: vi.fn(),
      search: undefined,
      sorting: undefined,
      filters: undefined,
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
      flattenData: [{ id: '1', name: 'Test Project' }],
      isError: false,
      totalCount: 1,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      setSorting: vi.fn(),
      search: undefined,
      sorting: undefined,
      filters: undefined,
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
      flattenData: [{ id: '1', name: 'Test Project' }],
      isError: false,
      totalCount: 1,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      setSorting: vi.fn(),
      search: undefined,
      sorting: undefined,
      filters: undefined,
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
      flattenData: [{ id: '1', name: 'Test Project' }],
      isError: false,
      totalCount: 1,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      setSorting: vi.fn(),
      search: undefined,
      sorting: undefined,
      filters: undefined,
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
      flattenData: [{ id: '1', name: 'Test Project' }],
      isError: false,
      totalCount: 1,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      setSorting: vi.fn(),
      search: undefined,
      sorting: undefined,
      filters: undefined,
    } as unknown) as ReturnType<typeof useResourcesV6>);

    vi.mocked(useTrustedZoneBanner).mockReturnValue({
      isBannerVisible: false,
      isLoading: true,
    });

    render(<Listing />, { wrapper });

    expect(screen.queryByTestId('ods-button')).not.toBeInTheDocument();
  });
});

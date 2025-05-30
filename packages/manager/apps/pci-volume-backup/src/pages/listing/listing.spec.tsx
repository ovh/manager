import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useResourcesV6 } from '@ovh-ux/manager-react-components';
import { useDatagridColumn } from '@/pages/listing/useDatagridColumn';
import Listing from './Listing.page';

vi.mock('@/pages/listing/useDatagridColumn', () => ({
  useDatagridColumn: vi.fn(() => [
    { id: 'name', label: 'Name' },
    { id: 'size', label: 'Size' },
  ]),
}));

vi.mock('@/data/api/volumeBackup', () => ({
  getVolumeBackups: () => () => Promise.resolve({ data: [] }),
  refetchInterval: 30000,
}));

vi.mock('@/pci-volume-backup.config', () => ({
  default: {
    changeLogLinks: [],
  },
}));

describe('Listing Component', () => {
  const mockVolumeBackupsWithData = ({
    data: { data: [{ id: '1', name: 'Backup 1', region: 'EU' }] },
    flattenData: [{ id: '1', name: 'Backup 1', region: 'EU' }],
    totalCount: 1,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    isLoading: false,
    search: {},
    sorting: { id: 'creationDate', desc: true },
    setSorting: vi.fn(),
    filters: {},
  } as unknown) as ReturnType<typeof useResourcesV6>;

  const mockVolumeBackupsEmpty = ({
    data: { data: [] },
    flattenData: [],
    totalCount: 0,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    isLoading: false,
    search: {},
    sorting: { id: 'creationDate', desc: true },
    setSorting: vi.fn(),
    filters: {},
  } as unknown) as ReturnType<typeof useResourcesV6>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component with data', () => {
    vi.mocked(useResourcesV6).mockReturnValue(mockVolumeBackupsWithData);

    render(<Listing />);

    // Check main components are rendered
    expect(screen.getByTestId('base-layout')).toBeInTheDocument();
    expect(screen.getByTestId('datagrid')).toBeInTheDocument();

    // Should not redirect to onboarding
    expect(screen.getByTestId('not-redirected')).toBeInTheDocument();

    // Check header
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toHaveTextContent(
      'pci_projects_project_storages_volume_backup_list_header',
    );

    // Check breadcrumb
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
    expect(breadcrumbItems).toHaveLength(2);
  });

  it('should redirect to onboarding when no volume backups are available', () => {
    vi.mocked(useResourcesV6).mockReturnValue(mockVolumeBackupsEmpty);

    render(<Listing />);

    // Should redirect to onboarding
    const redirectionGuard = screen.getByTestId('redirected');
    expect(redirectionGuard).toBeInTheDocument();
    expect(redirectionGuard).toHaveAttribute('data-route', '../onboarding');
  });

  it('should not redirect to onboarding when still loading', () => {
    vi.mocked(useResourcesV6).mockReturnValue({
      ...mockVolumeBackupsEmpty,
      isLoading: true,
    });

    render(<Listing />);

    // Should not redirect while loading
    expect(screen.getByTestId('not-redirected')).toBeInTheDocument();
  });

  it('should render the create button with correct props', () => {
    vi.mocked(useResourcesV6).mockReturnValue(mockVolumeBackupsWithData);

    render(<Listing />);

    const createButton = screen.getByTestId('button');
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveTextContent(
      'pci_projects_project_storages_volume_backup_list_datagrid_menu_topbar_action_create',
    );
  });

  it('should pass correct columns to Datagrid', () => {
    const mockColumns = ([
      { id: 'test', label: 'Test Column' },
    ] as unknown) as ReturnType<typeof useDatagridColumn>;
    vi.mocked(useDatagridColumn).mockReturnValue(mockColumns);
    vi.mocked(useResourcesV6).mockReturnValue(mockVolumeBackupsWithData);

    render(<Listing />);

    expect(useResourcesV6).toHaveBeenCalled();
    // The first argument should have columns property
    expect(useResourcesV6).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: expect.arrayContaining([
          expect.objectContaining({ id: 'test' }),
        ]),
      }),
    );
  });
});

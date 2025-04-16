import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { useDatagridColumn } from './useDatagridColumn';
import { TVolumeBackup } from '@/data/api/api.types';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useTranslatedMicroRegions: () => ({
    translateMicroRegion: (region: string) =>
      `manager_components_region_${region}_micro`,
  }),
}));

vi.mock('@/hooks/useFormattedDate', () => ({
  useFormattedDate: (date: string) => `formatted_${date}`,
}));

vi.mock('./Status.component', () => ({
  default: ({ status }: { status: string }) => `Status: ${status}`,
}));

vi.mock('./Actions.component', () => ({
  default: ({ snapshot }: { snapshot: { id: string } }) =>
    `Actions for ${snapshot.id}`,
}));

// Sample backup data
const mockBackup: TVolumeBackup = {
  id: 'backup-123',
  name: 'Test Backup',
  volumeId: 'volume-456',
  status: 'available',
  size: 10,
  region: 'us-east-1',
  creationDate: '2023-01-01T00:00:00Z',
  volume: {
    id: 'volume-456',
    name: 'Test Backup',
    status: 'available',
    size: 10,
    region: 'us-east-1',
    creationDate: '2023-01-01T00:00:00Z',
    description: 'Test Backup description',
    planCode: 'test-plan-code',
    attachedTo: [],
    bootable: false,
    availabilityZone: null,
    type: 'classic',
  },
};

describe('useDatagridColumn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct number of columns', () => {
    const { result } = renderHook(() => useDatagridColumn());

    expect(result.current).toBeInstanceOf(Array);
    expect(result.current).toHaveLength(8);
  });

  it('should have the correct column ids and labels', () => {
    const { result } = renderHook(() => useDatagridColumn());

    const columnIds = result.current.map((column) => column.id);
    expect(columnIds).toEqual([
      'name',
      'id',
      'region',
      'volumeId',
      'creationDate',
      'size',
      'status',
      'actions',
    ]);

    const labels = result.current.map((column) => column.label);
    expect(labels).toEqual([
      'pci_projects_project_storages_volume_backup_list_datagrid_column_name',
      'pci_projects_project_storages_volume_backup_list_datagrid_column_id',
      'pci_projects_project_storages_volume_backup_list_datagrid_column_region',
      'pci_projects_project_storages_volume_backup_list_datagrid_column_volume',
      'pci_projects_project_storages_volume_backup_list_datagrid_column_create_date',
      'pci_projects_project_storages_volume_backup_list_datagrid_column_capacity',
      'pci_projects_project_storages_volume_backup_list_datagrid_column_status',
      '',
    ]);
  });

  it('should mark the correct columns as sortable', () => {
    const { result } = renderHook(() => useDatagridColumn());

    // Actions column should not be sortable
    expect(result.current[7].isSortable).toBeFalsy();

    // Other columns should be sortable by default or explicitly set to true
    const otherColumnsSortable = result.current
      .filter((_, index) => index !== 0 && index !== 7)
      .every((col) => col.isSortable !== false);

    expect(otherColumnsSortable).toBe(true);
  });

  it('should render cell content correctly for each column', () => {
    const { result } = renderHook(() => useDatagridColumn());

    // Test name column cell renderer
    const { container: nameCell } = render(result.current[0].cell(mockBackup));
    expect(nameCell.textContent).toBe('Test Backup');

    // Test id column cell renderer
    const { container: idCell } = render(result.current[1].cell(mockBackup));
    expect(idCell.textContent).toBe('backup-123');

    // Test region column cell renderer
    const { container: regionCell } = render(
      result.current[2].cell(mockBackup),
    );
    expect(regionCell.textContent).toBe('us-east-1');

    // Test volume id column cell renderer
    const { container: volumeCell } = render(
      result.current[3].cell(mockBackup),
    );
    expect(volumeCell.textContent).toBe('volume-456');

    // Test creation date column cell renderer
    const { container: dateCell } = render(result.current[4].cell(mockBackup));
    expect(dateCell.textContent).toBe('formatted_2023-01-01T00:00:00Z');

    // Test size column cell renderer
    const { container: sizeCell } = render(result.current[5].cell(mockBackup));
    expect(sizeCell.textContent).toBe('10 unit_size_GiB');

    // Test status column cell renderer
    // TODO
    // const { container: statusCell } = render(
    //   result.current[6].cell(mockBackup),
    // );
    // expect(statusCell.textContent).toBe('Status: available');

    // Test actions column cell renderer
    // TODO
    // const { container: actionsCell } = render(
    //   result.current[7].cell(mockBackup),
    // );
    // expect(actionsCell.textContent).toBe('Actions for backup-123');
  });

  it('should handle missing volume data gracefully', () => {
    const { result } = renderHook(() => useDatagridColumn());

    // Create a snapshot without volume info
    const snapshotWithoutVolume = {
      ...mockBackup,
      volume: undefined,
    };

    // The cell should not throw an error
    expect(() => {
      result.current[3].cell(snapshotWithoutVolume);
    }).not.toThrow();
  });
});

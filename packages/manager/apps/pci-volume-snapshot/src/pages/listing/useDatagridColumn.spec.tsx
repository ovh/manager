import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { useDatagridColumn } from './useDatagridColumn';
import { TVolumeSnapshot } from '@/api/hooks/useSnapshots';

// Mock the hooks and components this hook depends on
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Return the key as the translation
  }),
}));

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

// Sample snapshot data for testing
const mockSnapshot: TVolumeSnapshot = {
  id: 'snap-123',
  name: 'Test Snapshot',
  region: 'EU-WEST-2',
  volume: {
    id: 'vol-456',
    name: 'Test Volume',
    attachedTo: [],
    creationDate: '2023-05-10T08:15:00Z',
    description: 'Test volume description',
    size: 10,
    status: 'available',
    region: 'EU-WEST-2',
    bootable: false,
    planCode: 'volume.classic',
    availabilityZone: 'EU-WEST-2a',
    type: 'classic',
  },
  volumeId: 'vol-456',
  size: 10,
  creationDate: '2023-05-15T10:30:00Z',
  status: 'available',
  description: 'Test snapshot description',
  planCode: 'snapshot.classic',
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
      'size',
      'creationDate',
      'status',
      'actions',
    ]);

    const labels = result.current.map((column) => column.label);
    expect(labels).toEqual([
      'pci_projects_project_storages_snapshots_name_label',
      'pci_projects_project_storages_snapshots_id_label',
      'pci_projects_project_storages_snapshots_region_label',
      'pci_projects_project_storages_snapshots_volume_label',
      'pci_projects_project_storages_snapshots_size_label',
      'pci_projects_project_storages_snapshots_creationDate_label',
      'pci_projects_project_storages_snapshots_status_label',
      '',
    ]);
  });

  it('should mark the correct columns as sortable', () => {
    const { result } = renderHook(() => useDatagridColumn());

    // Name column should not be sortable
    expect(result.current[0].isSortable).toBe(false);

    // Actions column should not be sortable
    expect(result.current[7].isSortable).toBe(false);

    // Other columns should be sortable by default or explicitly set to true
    const otherColumnsSortable = result.current
      .filter((_, index) => index !== 0 && index !== 7)
      .every((col) => col.isSortable !== false);

    expect(otherColumnsSortable).toBe(true);
  });

  it('should render cell content correctly for each column', () => {
    const { result } = renderHook(() => useDatagridColumn());

    // Test name column cell renderer
    const { container: nameCell } = render(
      result.current[0].cell(mockSnapshot),
    );
    expect(nameCell.textContent).toBe('Test Snapshot');

    // Test id column cell renderer
    const { container: idCell } = render(result.current[1].cell(mockSnapshot));
    expect(idCell.textContent).toBe('snap-123');

    // Test region column cell renderer
    const { container: regionCell } = render(
      result.current[2].cell(mockSnapshot),
    );
    expect(regionCell.textContent).toBe(
      'manager_components_region_EU-WEST-2_micro',
    );

    // Test volume name column cell renderer
    const { container: volumeCell } = render(
      result.current[3].cell(mockSnapshot),
    );
    expect(volumeCell.textContent).toBe('Test Volume');

    // Test size column cell renderer
    const { container: sizeCell } = render(
      result.current[4].cell(mockSnapshot),
    );
    expect(sizeCell.textContent).toBe('10 unit_size_GiB');

    // Test creation date column cell renderer
    const { container: dateCell } = render(
      result.current[5].cell(mockSnapshot),
    );
    expect(dateCell.textContent).toBe('formatted_2023-05-15T10:30:00Z');

    // Test status column cell renderer
    const { container: statusCell } = render(
      result.current[6].cell(mockSnapshot),
    );
    expect(statusCell.textContent).toBe('Status: available');

    // Test actions column cell renderer
    const { container: actionsCell } = render(
      result.current[7].cell(mockSnapshot),
    );
    expect(actionsCell.textContent).toBe('Actions for snap-123');
  });

  it('should handle missing volume data gracefully', () => {
    const { result } = renderHook(() => useDatagridColumn());

    // Create a snapshot without volume info
    const snapshotWithoutVolume = {
      ...mockSnapshot,
      volume: undefined,
    };

    // The cell should not throw an error
    expect(() => {
      result.current[3].cell(snapshotWithoutVolume);
    }).not.toThrow();
  });
});

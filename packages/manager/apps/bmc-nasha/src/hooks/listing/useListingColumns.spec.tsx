/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useListingColumns } from './useListingColumns';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock cell components
vi.mock('@/components/listing/ServiceNameCell.component', () => ({
  default: ({ serviceName }: any) => <div>{serviceName}</div>,
}));

vi.mock('@/components/listing/CanCreatePartitionCell.component', () => ({
  default: ({ canCreatePartition }: any) => <div>{String(canCreatePartition)}</div>,
}));

vi.mock('@/components/listing/CustomNameCell.component', () => ({
  default: ({ customName }: any) => <div>{customName}</div>,
}));

vi.mock('@/components/listing/DatacenterCell.component', () => ({
  default: ({ datacenter }: any) => <div>{datacenter}</div>,
}));

vi.mock('@/components/listing/DiskTypeCell.component', () => ({
  default: ({ diskType }: any) => <div>{diskType}</div>,
}));

describe('useListingColumns', () => {
  it('should return an array of column definitions', () => {
    const { result } = renderHook(() => useListingColumns());

    expect(result.current).toBeInstanceOf(Array);
    expect(result.current.length).toBeGreaterThan(0);
  });

  it('should include all required columns', () => {
    const { result } = renderHook(() => useListingColumns());
    const columns = result.current;

    const columnKeys = columns.map((col) => col.accessorKey);

    expect(columnKeys).toContain('serviceName');
    expect(columnKeys).toContain('canCreatePartition');
    expect(columnKeys).toContain('customName');
    expect(columnKeys).toContain('datacenter');
    expect(columnKeys).toContain('diskType');
    expect(columnKeys).toContain('monitored');
    expect(columnKeys).toContain('zpoolCapacity');
    expect(columnKeys).toContain('zpoolSize');
  });

  it('should have correct number of columns', () => {
    const { result } = renderHook(() => useListingColumns());

    // 5 visible + 3 hidden = 8 total columns
    expect(result.current).toHaveLength(8);
  });

  it('should mark monitored, zpoolCapacity, and zpoolSize as hidden by default', () => {
    const { result } = renderHook(() => useListingColumns());
    const columns = result.current;

    const hiddenColumns = columns.filter((col) => col.meta && (col.meta as any).isHiddenByDefault);

    expect(hiddenColumns).toHaveLength(3);
    expect(hiddenColumns.map((col) => col.accessorKey)).toEqual([
      'monitored',
      'zpoolCapacity',
      'zpoolSize',
    ]);
  });

  it('should have enableHiding true for all columns', () => {
    const { result } = renderHook(() => useListingColumns());
    const columns = result.current;

    columns.forEach((column) => {
      expect(column.enableHiding).toBe(true);
    });
  });

  it('should have proper translation keys for headers', () => {
    const { result } = renderHook(() => useListingColumns());
    const columns = result.current;

    columns.forEach((column) => {
      expect(column.header).toContain('listing:columns.');
    });
  });
});

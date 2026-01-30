import React from 'react';

import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useShareColumn } from '../useShareColumn';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@ovh-ux/muk', () => ({
  useBytes: () => ({
    formatBytes: (bytes: number) => `${bytes} B`,
  }),
  DatagridColumn: () => null,
}));

describe('useShareColumn', () => {
  it('should return an array of column definitions', () => {
    const { result } = renderHook(() => useShareColumn());

    const columns = result.current ?? [];
    expect(columns).toHaveLength(5);
    expect(columns[0]!.id).toBe('name_id');
    expect(columns[1]!.id).toBe('region');
    expect(columns[2]!.id).toBe('protocol');
    expect(columns[3]!.id).toBe('allocated_capacity');
    expect(columns[4]!.id).toBe('status');
  });

  it('should use region column with cell that translates regionDisplayKey', () => {
    const { result } = renderHook(() => useShareColumn());
    const columns = result.current ?? [];
    const regionColumn = columns[1]! as {
      id: string;
      accessorKey?: string;
      cell?: (ctx: { row: { original: { regionDisplayKey: string } } }) => React.ReactNode;
    };
    expect(regionColumn.id).toBe('region');
    expect(regionColumn.accessorKey).toBe('region');
    expect(regionColumn.cell).toBeDefined();
    const cell = regionColumn.cell?.({
      row: {
        original: {
          regionDisplayKey: 'regions:manager_components_region_GRA_micro',
        },
      },
    } as never);
    render(cell as React.ReactElement);
    expect(screen.getByText('regions:manager_components_region_GRA_micro')).toBeInTheDocument();
  });

  it('should render status column with Badge and mapped label', () => {
    const { result } = renderHook(() => useShareColumn());
    const columns = result.current ?? [];
    const statusColumn = columns[4]!;
    const cellRenderer = statusColumn.cell;
    expect(cellRenderer).toBeDefined();
    expect(typeof cellRenderer).toBe('function');

    const row = {
      original: {
        id: 'share-1',
        name: 'My Share',
        region: 'GRA9',
        regionDisplayKey: 'regions:manager_components_region_GRA_micro',
        protocol: 'NFS',
        size: 1000,
        status: 'available',
        statusDisplay: { labelKey: 'list:status.active', badgeColor: 'success' },
      },
    };
    const cell = (cellRenderer as (ctx: unknown) => React.ReactNode)({
      row: row as never,
      getValue: () => 'available',
      column: {} as never,
      table: {} as never,
      cell: {} as never,
      renderValue: () => 'available',
    });
    render(cell as React.ReactElement);
    expect(screen.getByText('list:status.active')).toBeInTheDocument();
  });
});

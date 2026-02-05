import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { useShareColumn } from '../useShareColumn';

vi.mock('@ovh-ux/muk', () => ({
  DatagridColumn: () => null,
}));

describe('useShareColumn', () => {
  it('should return an array of column definitions', () => {
    const { result } = renderHook(() => useShareColumn());

    const columns = result.current ?? [];
    expect(columns).toHaveLength(6);
    expect(columns[0]!.id).toBe('name_id');
    expect(columns[1]!.id).toBe('region');
    expect(columns[2]!.id).toBe('protocol');
    expect(columns[3]!.id).toBe('allocated_capacity');
    expect(columns[4]!.id).toBe('status');
    expect(columns[5]!.id).toBe('actions');
  });

  it('should use allocated_capacity column with cell that translates capacity in GiB', () => {
    const { result } = renderHook(() => useShareColumn());
    const columns = result.current ?? [];
    const capacityColumn = columns[3]! as {
      id: string;
      cell?: (ctx: { getValue: () => number }) => string;
    };
    expect(capacityColumn.id).toBe('allocated_capacity');
    expect(capacityColumn.cell).toBeDefined();
    const sizeBytes = 150;
    const cell = capacityColumn.cell?.({
      getValue: () => sizeBytes,
    } as never);
    expect(cell).toBe('list:columns.allocated_capacity_value{"capacity":150}');
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
          region: 'GRA11',
        },
      },
    } as never);
    render(cell as React.ReactElement);

    expect(screen.getByText('regions:manager_components_region_GRA_micro{"micro":"GRA11"}')).toBeInTheDocument();
  });

  it('should render status column with Badge and mapped label', () => {
    const { result } = renderHook(() => useShareColumn());
    const columns = result.current ?? [];
    const statusColumn = columns[4]! as { cell?: (ctx: unknown) => React.ReactNode };
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
        actions: new Map([
          ['actions', [{ label: 'list:actions.manage', link: { path: './share-1' } }]],
        ]),
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

  it('should render actions column with ActionsMenu using row.original.actions', async () => {
    const user = userEvent.setup();
    const { result } = renderHook(() => useShareColumn());
    const columns = result.current ?? [];
    const actionsColumn = columns[5]! as {
      cell?: (ctx: { row: { original: { actions: Map<string, unknown[]> } } }) => React.ReactNode;
    };
    const cellRenderer = actionsColumn.cell;
    expect(cellRenderer).toBeDefined();

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
        actions: new Map([
          [
            'actions',
            [
              { label: 'list:actions.manage', link: { path: './share-1' } },
              { label: 'list:actions.delete', link: { path: './share-1/delete' } },
            ],
          ],
        ]),
      },
    };
    const cell = (cellRenderer as (ctx: unknown) => React.ReactNode)({
      row: row as never,
      getValue: () => undefined,
      column: {} as never,
      table: {} as never,
      cell: {} as never,
      renderValue: () => undefined,
    });
    render(<MemoryRouter>{cell as React.ReactElement}</MemoryRouter>);
    const trigger = screen.getByRole('button', { name: 'actions' });
    await act(async () => {
      await user.click(trigger);
    });
    expect(screen.getByRole('link', { name: 'list:actions.manage' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'list:actions.delete' })).toBeVisible();
  });
});

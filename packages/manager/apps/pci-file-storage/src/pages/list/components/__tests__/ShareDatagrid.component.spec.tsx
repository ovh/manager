import React from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TShareListRow } from '@/adapters/shares/left/shareList.data';
import { useShares } from '@/data/hooks/shares/useShares';

import { ShareDatagrid } from '../ShareDatagrid.component';

vi.mock('@/hooks/useProjectId', () => ({
  useProjectId: () => 'test-project',
}));

vi.mock('@/data/hooks/shares/useShares', () => ({
  useShares: vi.fn(),
}));

vi.mock('@ovh-ux/muk', () => ({
  Datagrid: ({ data, isLoading }: { data: unknown[]; isLoading: boolean }) => (
    <div data-testid="datagrid">
      <span>{isLoading ? 'Loading' : `Rows: ${data.length}`}</span>
    </div>
  ),
  DatagridColumn: () => null,
  useBytes: () => ({ formatBytes: (bytes: number) => `${bytes} B` }),
}));

vi.mock('@/pages/list/hooks/useShareColumn', () => ({
  useShareColumn: () => [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'region', accessorKey: 'region', header: 'Region' },
  ],
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('ShareDatagrid', () => {
  it('should render datagrid with data', () => {
    const data: TShareListRow[] = [
      {
        id: 'share-1',
        name: 'My Share',
        region: 'GRA9',
        regionDisplayKey: 'regions:manager_components_region_GRA_micro',
        protocol: 'NFS',
        size: 100,
        status: 'available',
        statusDisplay: { labelKey: 'list:status.active', badgeColor: 'success' },
      },
    ];

    vi.mocked(useShares).mockReturnValue({
      data: data,
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TShareListRow[]>);

    render(<ShareDatagrid />);

    const datagrid = screen.getByTestId('datagrid');
    expect(datagrid).toBeVisible();
    expect(datagrid).toHaveTextContent('Rows: 1');
  });

  it('should show loading state', () => {
    vi.mocked(useShares).mockReturnValue({
      data: [],
      isLoading: true,
    } as unknown as QueryObserverSuccessResult<TShareListRow[]>);

    render(<ShareDatagrid />);

    expect(screen.getByTestId('datagrid')).toHaveTextContent('Loading');
  });
});

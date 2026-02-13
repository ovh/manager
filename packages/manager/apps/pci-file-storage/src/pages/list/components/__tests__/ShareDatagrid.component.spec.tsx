import React from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useShares } from '@/data/hooks/shares/useShares';
import { TShareListRow } from '@/pages/list/view-model/shareList.view-model';

import { ShareDatagrid } from '../ShareDatagrid.component';

vi.mock('@/hooks/useProjectId', () => ({
  useProjectId: () => 'test-project',
}));

vi.mock('@/pages/list/components/ShareDatagridTopbar.component', () => ({
  ShareDatagridTopbar: () => <div data-testid="share-datagrid-topbar" />,
}));

vi.mock('@/data/hooks/shares/useShares', () => ({
  useShares: vi.fn(),
}));

vi.mock('@ovh-ux/muk', () => ({
  Datagrid: ({
    data,
    isLoading,
    topbar,
  }: {
    data: unknown[];
    isLoading: boolean;
    topbar?: React.ReactNode;
  }) => (
    <div data-testid="datagrid">
      {topbar}
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

describe('ShareDatagrid', () => {
  it('should render datagrid with topbar and data', () => {
    const data: TShareListRow[] = [
      {
        id: 'share-1',
        name: 'My Share',
        region: 'GRA9',
        regionDisplayKey: 'regions:manager_components_region_GRA_micro',
        protocol: 'NFS',
        size: 100,
        status: 'available',
        statusDisplay: { labelKey: 'status:active', badgeColor: 'success' },
        actions: new Map([
          [
            'actions',
            [{ labelTranslationKey: 'share:actions.manage', link: { path: './GRA9/share-1' } }],
          ],
        ]),
      },
    ];

    vi.mocked(useShares).mockReturnValue({
      data,
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TShareListRow[]>);

    render(<ShareDatagrid />);

    expect(screen.getByTestId('share-datagrid-topbar')).toBeVisible();
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

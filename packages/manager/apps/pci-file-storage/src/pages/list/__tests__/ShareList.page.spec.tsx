import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useShares } from '@/data/hooks/shares/useShares';
import ShareListPage from '@/pages/list/ShareList.page';
import { TShareListRow } from '@/pages/list/view-model/shareList.view-model';

vi.mock('@/components/breadcrumb/Breadcrumb.component', () => ({
  Breadcrumb: () => <div>Breadcrumb</div>,
}));

vi.mock('@/data/hooks/shares/useShares', () => ({
  useShares: vi.fn().mockReturnValue({
    data: [
      {
        id: 'share-1',
        name: 'My Share',
        region: 'GRA9',
        regionDisplayKey: 'regions:manager_components_region_GRA_micro',
        protocol: 'NFS',
        size: 161061273600,
        status: 'available',
        statusDisplay: { labelKey: 'status:active', badgeColor: 'success' },
        actions: new Map([
          [
            'actions',
            [{ labelTranslationKey: 'list:actions.manage', link: { path: './GRA9/share-1' } }],
          ],
        ]),
      },
    ],
    isLoading: false,
  } as unknown as QueryObserverSuccessResult<TShareListRow[]>),
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
}));

describe('ShareList page', () => {
  it('should render breadCrumb, page heading and datagrid', () => {
    render(
      <MemoryRouter>
        <ShareListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Breadcrumb')).toBeVisible();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('list:title');
    expect(screen.getByRole('heading', { level: 2 })).toBeVisible();
    const datagrid = screen.getByTestId('datagrid');
    expect(datagrid).toBeVisible();
    expect(datagrid).toHaveTextContent('Rows: 1');
    expect(screen.getByRole('button', { name: 'list:actionButton' })).toBeVisible();
  });

  it('should redirect to onboarding when there are no shares', () => {
    vi.mocked(useShares).mockReturnValueOnce({
      data: [],
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TShareListRow[]>);
    render(
      <MemoryRouter>
        <ShareListPage />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });
});

import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useShares } from '@/data/hooks/shares/useShares';
import ShareListPage from '@/pages/list/ShareList.page';
import { TShareListRow } from '@/pages/list/view-model/shareList.view-model';

vi.mock('@/components/breadcrumb/Breadcrumb.component', () => ({
  Breadcrumb: () => <div>Breadcrumb</div>,
}));

vi.mock('@/hooks/useGetUser', () => ({
  useGetUser: () => ({ ovhSubsidiary: 'FR' }),
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
            [{ labelTranslationKey: 'share:actions.manage', link: { path: './GRA9/share-1' } }],
          ],
        ]),
      },
    ] as TShareListRow[],
    isLoading: false,
    fetchNextPage: vi.fn(),
    fetchPreviousPage: vi.fn(),
    hasNextPage: false,
    hasPreviousPage: false,
    isFetchingNextPage: false,
    isFetchingPreviousPage: false,
  }),
}));

vi.mock('@/pages/list/components/ShareDatagrid.component', () => ({
  ShareDatagrid: () => (
    <div data-testid="datagrid">
      <span>Rows: 1</span>
      <button type="button">list:actionButton</button>
    </div>
  ),
}));

vi.mock('@ovh-ux/muk', () => ({
  BaseLayout: ({
    children,
    breadcrumb,
    header,
  }: {
    children: React.ReactNode;
    breadcrumb: React.ReactNode;
    header?: { title?: React.ReactNode };
  }) => (
    <div>
      {breadcrumb}
      {header?.title != null && <h1>{header.title}</h1>}
      {children}
    </div>
  ),
  ChangelogMenu: () => <div>ChangelogMenu</div>,
  GuideMenu: () => <div>GuideMenu</div>,
}));

describe('ShareList page', () => {
  it('should render breadCrumb, page heading and datagrid', () => {
    render(
      <MemoryRouter>
        <ShareListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Breadcrumb')).toBeVisible();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('list:title');
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible();
    const datagrid = screen.getByTestId('datagrid');
    expect(datagrid).toBeVisible();
    expect(datagrid).toHaveTextContent('Rows: 1');
    expect(screen.getByRole('button', { name: 'list:actionButton' })).toBeVisible();
  });

  it('should redirect to onboarding when there are no shares', () => {
    vi.mocked(useShares).mockReturnValueOnce({
      data: [],
      isLoading: false,
      fetchNextPage: vi.fn(),
      fetchPreviousPage: vi.fn(),
      hasNextPage: false,
      hasPreviousPage: false,
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
    } as unknown as ReturnType<typeof useShares>);
    render(
      <MemoryRouter>
        <ShareListPage />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });
});

import React from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAcls } from '@/data/hooks/acl/useAcls';
import { useShare } from '@/data/hooks/shares/useShare';
import { TAclData } from '@/pages/dashboard/Acl/acl.view-model';

import { AclDatagrid } from '../AclDatagrid.component';

vi.mock('@/hooks/useShareParams', () => ({
  useShareParams: () => ({ region: 'GRA9', shareId: 'share-1' }),
}));

vi.mock('@/data/hooks/shares/useShare', () => ({
  useShare: vi.fn(),
}));

vi.mock('@/data/hooks/acl/useAcls', () => ({
  useAcls: vi.fn(),
}));

vi.mock('@/pages/dashboard/Acl/hooks/useAclActions', () => ({
  useAclActions: vi.fn().mockReturnValue({
    createAcl: vi.fn(),
    deleteAcl: vi.fn(),
    isDeletePending: false,
    isCreatePending: false,
  }),
}));

vi.mock('@/pages/dashboard/Acl/hooks/useAclDatagridFiltering', () => ({
  useAclDatagridFiltering: vi.fn((acls: unknown[]) => ({
    filteredAcls: acls,
    filterProps: { add: vi.fn(), filters: [], remove: vi.fn() },
    searchProps: {
      onSearch: vi.fn(),
      placeholder: '',
      searchInput: '',
      setSearchInput: vi.fn(),
    },
  })),
}));

vi.mock('@/pages/dashboard/Acl/components/AclDatagridTopbar.component', () => ({
  AclDatagridTopbar: () => <div data-testid="acl-datagrid-topbar" />,
}));

vi.mock('@/pages/dashboard/Acl/components/AclDeleteModal.component', () => ({
  AclDeleteModal: () => <div data-testid="acl-delete-modal" />,
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
    <div data-testid="acl-datagrid">
      {topbar}
      <span>{isLoading ? 'Loading' : `Rows: ${data.length}`}</span>
    </div>
  ),
  DatagridColumn: () => null,
}));

vi.mock('@/pages/dashboard/Acl/hooks/useAclColumn', () => ({
  useAclColumn: () => [
    { id: 'accessTo', accessorKey: 'accessTo', header: 'Access to' },
    { id: 'permission', accessorKey: 'permission', header: 'Permission' },
  ],
}));

describe('AclDatagrid', () => {
  it('should render datagrid with topbar and row count', () => {
    const acls: TAclData[] = [
      {
        id: 'acl-1',
        accessTo: '10.0.0.0',
        permission: 'readOnly',
        status: 'active',
        statusDisplay: { labelKey: 'status:active', badgeColor: 'success' },
      } as TAclData,
    ];

    vi.mocked(useShare).mockReturnValue({
      data: true,
    } as unknown as QueryObserverSuccessResult<boolean>);
    vi.mocked(useAcls).mockReturnValue({
      data: acls,
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TAclData[]>);

    render(<AclDatagrid />);

    expect(screen.getByTestId('acl-datagrid-topbar')).toBeVisible();
    const datagrid = screen.getByTestId('acl-datagrid');
    expect(datagrid).toBeVisible();
    expect(datagrid).toHaveTextContent('Rows: 1');
  });

  it('should show loading state when isLoadingAcls is true', () => {
    vi.mocked(useShare).mockReturnValue({
      data: true,
    } as unknown as QueryObserverSuccessResult<boolean>);
    vi.mocked(useAcls).mockReturnValue({
      data: [],
      isLoading: true,
    } as unknown as QueryObserverSuccessResult<TAclData[]>);

    render(<AclDatagrid />);

    expect(screen.getByTestId('acl-datagrid')).toHaveTextContent('Loading');
  });
});

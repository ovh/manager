import { renderHook, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { applyFilters } from '@ovh-ux/manager-core-api';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ColumnSort, PaginationState } from '@tanstack/react-table';
import { useAllLoadBalancers, useLoadBalancers } from './useLoadBalancer';
import { paginateResults, sortResults } from '@/helpers';
import { TLoadBalancer } from '@/types';
import { wrapper } from '@/wrapperRenders';
import { mockLoadBalancers } from '@/mocks';

vi.mock('@/helpers', () => ({
  paginateResults: vi.fn(),
  sortResults: vi.fn(),
}));
vi.mock('./useLoadBalancer', async () => {
  const mod = await vi.importActual('./useLoadBalancer');
  return {
    ...mod,
    useAllLoadBalancers: vi.fn(),
  };
});

describe('useLoadBalancers', () => {
  const projectId = 'test-project';
  const pagination: PaginationState = { pageIndex: 1, pageSize: 10 };
  const sorting: ColumnSort = { id: 'name', desc: false };
  const filters = [];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return data when loaded', async () => {
    vi.mocked(applyFilters).mockReturnValue(mockLoadBalancers);
    vi.mocked(sortResults).mockReturnValue(mockLoadBalancers);
    vi.mocked(paginateResults).mockReturnValue({
      rows: mockLoadBalancers,
      totalRows: 1,
      pageCount: 1,
    });
    vi.mocked(useAllLoadBalancers).mockReturnValue({
      data: mockLoadBalancers,
      error: null,
      isLoading: false,
      isPending: false,
    } as UseQueryResult<TLoadBalancer[]>);

    const { result } = renderHook(
      () => useLoadBalancers(projectId, pagination, sorting, filters),
      { wrapper },
    );

    await waitFor(() =>
      expect(result.current.data).toEqual({
        rows: mockLoadBalancers,
        totalRows: 1,
        pageCount: 1,
      }),
    );
  });
});

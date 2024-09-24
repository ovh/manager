import { useQuery } from '@tanstack/react-query';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useMemo } from 'react';
import { ColumnSort, PaginationState } from '@tanstack/react-table';
import { getLoadBalancers } from '@/api/data/load-balancer';
import { TLoadBalancer } from '@/types';
import { paginateResults, sortResults } from '@/helpers';

export const useAllLoadBalancers = (projectId: string) =>
  useQuery({
    queryKey: ['load-balancers', projectId],
    queryFn: () => getLoadBalancers(projectId),
    select: (data) => data.resources,
  });

export const useLoadBalancers = (
  projectId: string,
  pagination: PaginationState,
  sorting: ColumnSort,
  filters: Filter[],
) => {
  const {
    data: loadBalancers,
    error,
    isLoading,
    isPending,
  } = useAllLoadBalancers(projectId);

  return useMemo(
    () => ({
      isLoading,
      isPending,
      data: paginateResults<TLoadBalancer>(
        sortResults(applyFilters(loadBalancers || [], filters), sorting),
        pagination,
      ),
      error,
    }),
    [loadBalancers, error, isLoading, isPending, pagination, sorting, filters],
  );
};

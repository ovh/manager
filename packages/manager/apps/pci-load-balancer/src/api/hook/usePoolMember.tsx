import { Filter, applyFilters } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { TPoolMember, getPoolMembers } from '@/api/data/pool-member';
import { paginateResults, sortResults } from '@/helpers';

export const useGetAllPoolMembers = (
  projectId: string,
  poolId: string,
  region: string,
) =>
  useQuery({
    queryKey: ['poolMembers', projectId, 'pool', poolId, region],
    queryFn: () => getPoolMembers(projectId, region, poolId),
    select: (poolMembers: TPoolMember[]) =>
      poolMembers.map((member) => ({
        ...member,
        search: `${member.name} ${member.address} ${member.protocolPort}`,
      })),
  });

export const usePoolMembers = (
  projectId: string,
  policyId: string,
  region: string,
  pagination: PaginationState,
  sorting: ColumnSort,
  filters: Filter[],
) => {
  const {
    data: allPoolMembers,
    error,
    isLoading,
    isPending,
  } = useGetAllPoolMembers(projectId, policyId, region);
  return useMemo(
    () => ({
      isLoading,
      isPending,
      allPoolMembers,
      paginatedPoolMembers: paginateResults<TPoolMember>(
        sortResults<TPoolMember>(
          applyFilters(allPoolMembers || [], filters),
          sorting,
        ),
        pagination,
      ),
      error,
    }),
    [allPoolMembers, error, isLoading, isPending, pagination, sorting, filters],
  );
};

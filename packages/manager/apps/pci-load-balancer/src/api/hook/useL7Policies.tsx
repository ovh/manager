import { useQuery } from '@tanstack/react-query';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useMemo } from 'react';
import { getL7Policies, TL7Policy } from '@/api/data/l7Policies';
import { paginateResults, sortResults } from '@/helpers';
import { ACTION_LABELS, ACTIONS } from '@/constants';

const getAttribute = (policy: TL7Policy) => {
  switch (policy.action) {
    case ACTIONS.REDIRECT_TO_URL:
      return policy.redirectUrl;
    case ACTIONS.REDIRECT_PREFIX:
      return policy.redirectPrefix;
    case ACTIONS.REDIRECT_TO_POOL:
      return policy.redirectPoolId;
    default:
      return '-';
  }
};

export const useGetAllL7Policies = (
  projectId: string,
  listenerId: string,
  region: string,
) =>
  useQuery({
    queryKey: ['l7Policies', projectId, listenerId, region],
    queryFn: () => getL7Policies(projectId, region, listenerId),
    select: (l7Policies) =>
      l7Policies.map((l7Policy) => {
        const action = ACTION_LABELS[l7Policy.action];
        const attribute = getAttribute(l7Policy);
        return {
          ...l7Policy,
          attribute,
          action,
          search: `${l7Policy.position} ${l7Policy.name} ${action} ${attribute} ${l7Policy.redirectHttpCode} ${l7Policy.provisioningStatus} ${l7Policy.operatingStatus} ${l7Policy.redirectUrl} ${l7Policy.redirectPrefix} ${l7Policy.redirectPoolId}`,
        };
      }),
  });

export const useL7Policies = (
  projectId: string,
  listenerId: string,
  region: string,
  pagination: PaginationState,
  sorting: ColumnSort,
  filters: Filter[],
) => {
  const {
    data: allL7Policies,
    error,
    isLoading,
    isPending,
  } = useGetAllL7Policies(projectId, region, listenerId);
  return useMemo(
    () => ({
      isLoading,
      isPending,
      allL7Policies,
      paginatedL7Policies: paginateResults<TL7Policy>(
        sortResults<TL7Policy>(
          applyFilters(allL7Policies || [], filters),
          sorting,
        ),
        pagination,
      ),
      error,
    }),
    [allL7Policies, error, isLoading, isPending, pagination, sorting, filters],
  );
};

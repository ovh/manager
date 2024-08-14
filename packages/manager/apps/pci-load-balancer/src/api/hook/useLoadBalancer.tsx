import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { paginateResults, sortResults } from '@/helpers';
import {
  getLoadBalancer,
  getLoadBalancerFlavor,
  getLoadBalancers,
  TLoadBalancer,
} from '../data/load-balancer';

export const useAllLoadBalancers = (projectId: string) =>
  useQuery({
    queryKey: [projectId, 'loadBalancers'],
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
      paginatedLoadBalancer: paginateResults<TLoadBalancer>(
        sortResults(applyFilters(loadBalancers || [], filters), sorting),
        pagination,
      ),
      allLoadBalancer: loadBalancers,
      error,
    }),
    [loadBalancers, error, isLoading, isPending, pagination, sorting, filters],
  );
};

export const useLoadBalancer = ({
  projectId,
  region,
  loadBalancerId,
}: {
  projectId: string;
  region: string;
  loadBalancerId: string;
}) =>
  useQuery({
    queryKey: [
      'project',
      projectId,
      'region',
      region,
      'loadBalancer',
      loadBalancerId,
    ],
    queryFn: () => getLoadBalancer(projectId, region, loadBalancerId),
    throwOnError: true,
  });

export const useLoadBalancerFlavor = ({
  projectId,
  region,
  flavorId,
}: {
  projectId: string;
  region: string;
  flavorId: string;
}) =>
  useQuery({
    queryKey: ['project', projectId, 'region', region, 'flavor', flavorId],
    queryFn: () => getLoadBalancerFlavor(projectId, region, flavorId),
    enabled: !!flavorId,
    throwOnError: true,
  });
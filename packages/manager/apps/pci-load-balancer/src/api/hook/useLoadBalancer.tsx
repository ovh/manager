import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import queryClient from '@/queryClient';
import { paginateResults, sortResults } from '@/helpers';
import {
  createLoadBalancer,
  deleteLoadBalancer,
  getLoadBalancer,
  getLoadBalancerFlavor,
  getLoadBalancers,
  TCreateLoadBalancerParam,
  TLoadBalancer,
  updateLoadBalancerName,
} from '../data/load-balancer';

export const getAllLoadBalancersQueryKey = (projectId: string) => [
  'load-balancers',
  projectId,
];

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

type DeleteLoadBalancerProps = {
  projectId: string;
  loadBalancer: TLoadBalancer;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteLoadBalancer = ({
  projectId,
  loadBalancer,
  onError,
  onSuccess,
}: DeleteLoadBalancerProps) => {
  const mutation = useMutation({
    mutationFn: async () => deleteLoadBalancer(projectId, loadBalancer),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getAllLoadBalancersQueryKey(projectId),
      });
      onSuccess();
    },
  });
  return {
    deleteLoadBalancer: () => mutation.mutate(),
    ...mutation,
  };
};

type RenameLoadBalancerProps = {
  projectId: string;
  loadBalancer: TLoadBalancer;
  name: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useRenameLoadBalancer = ({
  projectId,
  loadBalancer,
  name,
  onError,
  onSuccess,
}: RenameLoadBalancerProps) => {
  const mutation = useMutation({
    mutationFn: async () =>
      updateLoadBalancerName(projectId, loadBalancer, name),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          'project',
          projectId,
          'region',
          loadBalancer.region,
          'loadBalancer',
          loadBalancer.id,
        ],
      });
      onSuccess();
    },
  });
  return {
    renameLoadBalancer: () => mutation.mutate(),
    ...mutation,
  };
};

export const useCreateLoadBalancer = ({
  projectId,
  flavor,
  region,
  floatingIp,
  privateNetwork,
  subnet,
  gateways,
  listeners,
  name,
  onSuccess,
  onError,
}: TCreateLoadBalancerParam & {
  onError: (cause: Error) => void;
  onSuccess: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: async () =>
      createLoadBalancer({
        projectId,
        flavor,
        region,
        floatingIp,
        privateNetwork,
        subnet,
        gateways,
        listeners,
        name,
      }),
    onError,
    onSuccess: async () => {
      // TDOO invalidate right query
      // await queryClient.invalidateQueries({
      //   queryKey: getAllLoadBalancersQueryKey(projectId),
      // });
      onSuccess();
    },
  });
  return {
    doCreateLoadBalancer: () => mutation.mutate(),
    ...mutation,
  };
};

import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { paginateResults, sortResults } from '@/helpers';
import {
  createListener,
  deleteLoadBalancer,
  getLoadBalancer,
  getLoadBalancerFlavor,
  getLoadBalancerListeners,
  getLoadBalancers,
  TLoadBalancer,
  updateLoadBalancerName,
  TLoadBalancerListener,
  editListener,
  TCreateLoadBalancerParam,
  createLoadBalancer,
} from '../data/load-balancer';
import queryClient from '@/queryClient';
import { PROTOCOLS } from '@/constants';

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

export interface ListenerInfoProps {
  name: string;
  protocol: typeof PROTOCOLS[number];
  port: number;
  defaultPoolId?: string;
}

export interface CreateListenerProps {
  projectId: string;
  region: string;
  loadBalancerId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export const useCreateListener = ({
  projectId,
  region,
  loadBalancerId,
  onError,
  onSuccess,
}: CreateListenerProps) => {
  const mutation = useMutation({
    mutationFn: (listenerInfo: ListenerInfoProps) =>
      createListener({
        projectId,
        region,
        loadBalancerId,
        ...listenerInfo,
      }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['listeners'],
      });
      onSuccess();
    },
  });
  return {
    createListener: (listenerInfo: ListenerInfoProps) =>
      mutation.mutate(listenerInfo),
    ...mutation,
  };
};

export interface EditListenerProps {
  projectId: string;
  region: string;
  listenerId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export const useEditLoadBalancer = ({
  projectId,
  region,
  listenerId,
  onError,
  onSuccess,
}: EditListenerProps) => {
  const mutation = useMutation({
    mutationFn: ({
      name,
      defaultPoolId,
    }: {
      name: string;
      defaultPoolId?: string;
    }) =>
      editListener({
        projectId,
        region,
        listenerId,
        name,
        defaultPoolId,
      }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['listeners'],
      });
      onSuccess();
    },
  });
  return {
    editListener: ({
      name,
      defaultPoolId,
    }: {
      name: string;
      defaultPoolId?: string;
    }) =>
      mutation.mutate({
        name,
        defaultPoolId,
      }),
    ...mutation,
  };
};

export const useAllLoadBalancerListeners = ({
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
      'listeners',
      projectId,
      'region',
      region,
      'loadbalancer',
      loadBalancerId,
      'listeners',
    ],
    queryFn: () => getLoadBalancerListeners(projectId, region, loadBalancerId),
    enabled: !!region && !!loadBalancerId,
    select: (data) =>
      data.map((listener) => ({
        ...listener,
        search: `${listener.name} ${listener.defaultPoolId} ${listener.protocol} ${listener.port}`,
      })),
    throwOnError: true,
  });

export const useLoadBalancerListeners = (
  projectId: string,
  region: string,
  loadBalancerId: string,
  pagination: PaginationState,
  sorting: ColumnSort,
  filters: Filter[],
) => {
  const {
    data: loadBalancerListeners,
    error,
    isLoading,
    isPending,
  } = useAllLoadBalancerListeners({ projectId, region, loadBalancerId });

  return useMemo(
    () => ({
      isLoading,
      isPending,
      data: paginateResults<TLoadBalancerListener>(
        sortResults<TLoadBalancerListener>(
          applyFilters(loadBalancerListeners || [], filters),
          sorting,
        ),
        pagination,
      ),
      error,
    }),
    [
      loadBalancerListeners,
      error,
      isLoading,
      isPending,
      pagination,
      sorting,
      filters,
    ],
  );
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

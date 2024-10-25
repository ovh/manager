import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useMemo } from 'react';
import {
  createListener,
  deleteListener,
  editListener,
  getListener,
  getLoadBalancerListeners,
  TLoadBalancerListener,
} from '@/api/data/listener';
import queryClient from '@/queryClient';
import { PROTOCOLS } from '@/constants';
import { paginateResults, sortResults } from '@/helpers';

export interface ListenerInfoProps {
  name: string;
  protocol: typeof PROTOCOLS[number];
  port: number;
  defaultPoolId?: string;
}

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
    queryKey: ['listeners', projectId, region, loadBalancerId],
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
        queryKey: ['listeners', projectId, region, loadBalancerId],
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
        queryKey: ['listeners', projectId, region],
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

export const useListener = ({
  projectId,
  region,
  loadBalancerId,
  listenerId,
}: {
  projectId: string;
  region: string;
  loadBalancerId: string;
  listenerId: string;
}) =>
  useQuery({
    queryKey: ['listener', listenerId, projectId, region, loadBalancerId],
    queryFn: () => getListener(projectId, region, listenerId),
    throwOnError: true,
  });

type DeleteListenerProps = {
  projectId: string;
  loadBalancerId: string;
  listenerId: string;
  region: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteListener = ({
  projectId,
  loadBalancerId,
  listenerId,
  region,
  onError,
  onSuccess,
}: DeleteListenerProps) => {
  const mutation = useMutation({
    mutationFn: async () => deleteListener(projectId, region, listenerId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['listeners', projectId, region, loadBalancerId],
      });
      onSuccess();
    },
  });
  return {
    deleteListener: () => mutation.mutate(),
    ...mutation,
  };
};

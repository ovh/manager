import { PaginationState } from '@ovhcloud/manager-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Filter, applyFilters } from '@ovh-ux/manager-core-api';
import {
  FloatingIP,
  Instance,
  TerminateIPProps,
  UpdateInstanceProps,
} from '@/interface';
import {
  getAllAssociatedInstances,
  getAllFloatingIP,
  terminateFloatingIP,
  updateInstanceForFloatingIP,
} from '@/api/data/floating-ip';
import { useAllInstance } from './useInstance';
import queryClient from '@/queryClient';
import { paginateResults } from '@/api/utils/pagination';

export type FloatingIPOptions = {
  pagination: PaginationState;
};

const aggregateFloatingIPs = (
  floatingIPs: FloatingIP[],
  instanceData: Instance[],
) => {
  const aggregatedData = floatingIPs.map((floatingIP) => {
    const floatingIPResult = { ...floatingIP };
    if (
      floatingIP.associatedEntity &&
      floatingIP.associatedEntity?.type === 'instance'
    ) {
      const instance: Instance = instanceData.find(
        ({ id }) => id === floatingIP.associatedEntity.id,
      );

      floatingIPResult.associatedEntity.name = instance ? instance.name : '';
    }
    floatingIPResult.associatedEntityId = floatingIP.associatedEntity?.id;
    floatingIPResult.associatedEntityName =
      floatingIPResult.associatedEntity?.name;

    return { ...floatingIPResult };
  });

  return aggregatedData;
};

const getQueryKeyFloatingIPs = (projectId: string) => [
  'project',
  projectId,
  'floatingIps',
];

export const useAllFloatingIP = (projectId: string) => {
  return useQuery({
    queryKey: getQueryKeyFloatingIPs(projectId),
    queryFn: () => getAllFloatingIP(projectId),
    select: (ips) =>
      ips.map((ip) => ({
        ...ip,
        search: `${ip.ip} ${ip.associatedEntity?.id} ${ip.associatedEntity?.name} ${ip.region}`,
      })) as FloatingIP[],
  });
};

export const useFloatingIP = (projectId: string, ipId: string): FloatingIP => {
  const { data: floatingIPs } = useAllFloatingIP(projectId);
  return floatingIPs.find((floatingIP) => floatingIP.id === ipId) || undefined;
};

export const useFloatingIPs = (
  projectId: string,
  { pagination }: FloatingIPOptions,
  filters: Filter[] = [],
) => {
  const {
    data: floatingIPData,
    error: floatingIPError,
    isLoading: floatingIPLoading,
  } = useAllFloatingIP(projectId);

  const {
    data: instanceData,
    error: instanceError,
    isLoading: instanceLoading,
  } = useAllInstance(projectId);

  const error = floatingIPError || instanceError;
  const isLoading = floatingIPLoading || instanceLoading;

  return useMemo(() => {
    return {
      isLoading,
      error,
      data: paginateResults(
        applyFilters(
          aggregateFloatingIPs(floatingIPData || [], instanceData || []),
          filters,
        ),
        pagination,
      ),
    };
  }, [
    floatingIPData,
    floatingIPError,
    floatingIPLoading,
    instanceData,
    instanceError,
    instanceLoading,
    pagination,
    filters,
  ]);
};

export const useTerminateFloatingIP = ({
  projectId,
  onError,
  onSuccess,
}: TerminateIPProps) => {
  const mutation = useMutation({
    mutationFn: (floatingIp: FloatingIP) => {
      return terminateFloatingIP(projectId, floatingIp.region, floatingIp.id);
    },
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKeyFloatingIPs(projectId),
      });
      return onSuccess();
    },
  });

  return {
    terminate: (floatingIP: FloatingIP) => {
      return mutation.mutate(floatingIP);
    },
    ...mutation,
  };
};

export const useAllAssociatedInstances = (
  projectId: string,
  region: string,
) => {
  return useQuery({
    queryKey: ['project', projectId, 'region', region, 'floatingIps'],
    queryFn: () => getAllAssociatedInstances(projectId, region),
    enabled: !!region,
  });
};

export const useUpdateInstance = ({
  projectId,
  instanceId,
  floatingIP,
  ipAddresses,
  onError,
  onSuccess,
}: UpdateInstanceProps) => {
  const mutation = useMutation({
    mutationFn: () =>
      updateInstanceForFloatingIP(
        projectId,
        instanceId,
        ipAddresses,
        floatingIP,
      ),
    onSuccess: () => {
      queryClient.setQueryData(
        getQueryKeyFloatingIPs(projectId),
        (data: FloatingIP[]) =>
          data.map((floating) =>
            floating.id === floatingIP.id
              ? { ...floating, routedTo: instanceId }
              : floating,
          ),
      );

      return onSuccess();
    },
    onError,
  });

  return {
    attach: () => mutation.mutate(),
    ...mutation,
  };
};

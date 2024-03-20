import { PaginationState } from '@ovhcloud/manager-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { FloatingIP, Instance } from '@/interface';
import { getAllFloatingIP, terminateFloatingIP } from '@/api/data/floating-ip';
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
  });
};

export const useFloatingIP = (projectId: string, ipId: string): FloatingIP => {
  const { data: floatingIPs } = useAllFloatingIP(projectId);
  return floatingIPs.find((floatingIP) => floatingIP.id === ipId) || undefined;
};

export const useFloatingIPs = (
  projectId: string,
  { pagination }: FloatingIPOptions,
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
        aggregateFloatingIPs(floatingIPData || [], instanceData || []),
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
  ]);
};

type TerminateFloatingIPProps = {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useTerminateFloatingIP = ({
  projectId,
  onError,
  onSuccess,
}: TerminateFloatingIPProps) => {
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

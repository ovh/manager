import { PaginationState } from '@ovhcloud/manager-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Filter, applyFilters } from '@ovh-ux/manager-core-api';
import { FailoverIP, Instance, TerminateIPProps } from '@/interface';
import { getAllFailoverIP, terminateFailoverIP } from '@/api/data/failover-ip';
import { useAllInstance } from './useInstance';
import { paginateResults } from '@/api/utils/pagination';
import queryClient from '@/queryClient';

export type FailoverOptions = {
  pagination: PaginationState;
};

const aggregateFailoverIPs = (
  failoverIPData: FailoverIP[],
  instanceData: Instance[],
) => {
  const aggregatedData = failoverIPData.map((failover) => {
    let instance = {} as Instance;

    if (failover.routedTo) {
      instance = instanceData.find(({ id }) => id === failover.routedTo);
    }

    return {
      ...failover,
      associatedEntityName: instance ? instance.name : '',
    };
  });

  return aggregatedData;
};

const getQueryKeyFailoverIPs = (projectId: string) => [
  'project',
  projectId,
  'failover',
];

export const useAllFailoverIPs = (projectId: string) => {
  return useQuery({
    queryKey: getQueryKeyFailoverIPs(projectId),
    queryFn: () => getAllFailoverIP(projectId),
  });
};

export const useFailoverIPs = (
  projectId: string,
  { pagination }: FailoverOptions,
  filters: Filter[] = [],
) => {
  const {
    data: failoverIPData,
    error: failoverError,
    isLoading: failoverLoading,
  } = useAllFailoverIPs(projectId);

  const {
    data: instanceData,
    error: instanceError,
    isLoading: instanceLoading,
  } = useAllInstance(projectId);

  const error = failoverError || instanceError;
  const isLoading = failoverLoading || instanceLoading;

  return useMemo(() => {
    return {
      isLoading,
      error,
      data: paginateResults(
        applyFilters(
          aggregateFailoverIPs(failoverIPData || [], instanceData || []),
          filters,
        ),
        pagination,
      ),
    };
  }, [
    failoverIPData,
    failoverError,
    failoverLoading,
    instanceData,
    instanceError,
    instanceLoading,
    pagination,
  ]);
};

export const useTerminateFailoverIP = ({
  projectId,
  onError,
  onSuccess,
}: TerminateIPProps) => {
  const mutation = useMutation({
    mutationFn: (failoverIP: FailoverIP) => {
      return terminateFailoverIP(failoverIP.ip);
    },
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKeyFailoverIPs(projectId),
      });
      return onSuccess();
    },
  });

  return {
    terminate: (failoverIP: FailoverIP) => {
      return mutation.mutate(failoverIP);
    },
    ...mutation,
  };
};

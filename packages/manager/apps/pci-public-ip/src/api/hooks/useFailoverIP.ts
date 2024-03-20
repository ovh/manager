import { PaginationState } from '@ovhcloud/manager-components';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { FailoverIP, Instance } from '@/interface';
import { getAllFailoverIP } from '@/api/data/failover-ip';
import { useAllInstance } from './useInstance';
import { paginateResults } from '@/api/utils/pagination';

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
      associatedEntity: {
        name: instance ? instance.name : '',
      },
    };
  });

  return aggregatedData;
};

export const useAllFailoverIPs = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'failover'],
    queryFn: () => getAllFailoverIP(projectId),
  });
};

export const useFailoverIPs = (
  projectId: string,
  { pagination }: FailoverOptions,
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
        aggregateFailoverIPs(failoverIPData || [], instanceData || []),
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

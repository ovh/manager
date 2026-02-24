import { useMemo } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { networksQueryKey } from '@/adapters/network/queryKeys';
import { getNetworks } from '@/data/api/network.api';
import { TNetwork } from '@/domain/entities/network.entity';
import { useProjectId } from '@/hooks/useProjectId';
import { SelectOption } from '@/types/select-option';

export const useNetworks = <TData>(
  region: string | undefined,
  options?: SelectOption<TNetwork[], TData>,
) => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();

  const {
    data,
    error,
    isPending,
    isError,
    isSuccess,
    isFetching,
    isLoading,
    refetch: queryRefetch,
  } = useQuery<TNetwork[], Error, TData>({
    queryKey: networksQueryKey(projectId, region ?? ''),
    queryFn: () => getNetworks({ projectId, region: region! }),
    enabled: !!region,
    select: options?.select,
    retry: 1,
  });

  const refetch = useMemo(
    () => () => {
      void queryRefetch();
      void queryClient.invalidateQueries({
        predicate: (q) => q.queryKey.includes(region) && q.queryKey.includes('subnet'),
      });
    },
    [queryClient, queryRefetch, region],
  );

  return {
    data,
    error,
    isPending,
    isError,
    isSuccess,
    isFetching,
    isLoading,
    refetch,
  };
};

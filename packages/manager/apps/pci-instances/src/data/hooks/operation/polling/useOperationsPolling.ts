import { Query, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useEffect } from 'react';
import { getOperations } from '@/data/api/operation';
import { TOperation } from '@/types/operation/entity.type';
import { isApiErrorResponse } from '@/utils';

export type TUseOperationsPollingQueryOptions = Pick<
  UseQueryOptions<TOperation[]>,
  | 'refetchInterval'
  | 'gcTime'
  | 'refetchIntervalInBackground'
  | 'retry'
  | 'retryDelay'
>;

export type TUseOperationsPollingCallbacks = {
  onError?: (error: ApiError) => void;
  onSuccess?: (data: TOperation[] | undefined) => void;
};

const defaultQueryOptions: TUseOperationsPollingQueryOptions = {
  gcTime: 0,
  retryDelay: 3_000,
  refetchIntervalInBackground: true,
  refetchInterval: (query: Query<TOperation[]>) =>
    query.state.error ? false : 5_000,
};

export const useOperationsPolling = (
  projectId: string,
  options: TUseOperationsPollingQueryOptions = {},
  { onError, onSuccess }: TUseOperationsPollingCallbacks = {},
) => {
  const { data: operations, isPending, isError, error } = useQuery({
    queryKey: [projectId, 'operations'],
    queryFn: () => getOperations(projectId),
    refetchIntervalInBackground: true,
    ...defaultQueryOptions,
    ...options,
  });

  useEffect(() => {
    if (!isPending && isError && isApiErrorResponse(error)) onError?.(error);
    if (!isPending && !isError) onSuccess?.(operations);
  }, [operations, isPending, isError, error, onSuccess, onError]);

  return {
    operations,
    isPending,
  };
};

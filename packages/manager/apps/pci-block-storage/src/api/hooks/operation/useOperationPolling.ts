import { Query, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getOperation, TOperation } from '@/api/data/operation';

const getOperationQueryKey = (projectId: string, operationId: string) => [
  'operation',
  projectId,
  operationId,
];

export type TUseOperationPollingQueryOptions = Omit<
  UseQueryOptions<TOperation>,
  'queryFn' | 'queryKey'
>;

const DEFAULT_INTERVAL_IN_MS = 1000;

const defaultQueryOptions: TUseOperationPollingQueryOptions = {
  refetchIntervalInBackground: true,
  gcTime: 0,
  refetchInterval: (query: Query<TOperation>) =>
    query.state.error ? false : DEFAULT_INTERVAL_IN_MS,
};

export type TUseOperationPollingCallbacks = {
  onError?: () => void;
  onSuccess?: (data: TOperation | undefined) => void;
};

export const useOperationPolling = (
  projectId: string,
  operationId?: string,
  { onError, onSuccess }: TUseOperationPollingCallbacks = {},
  { enabled, ...queryOptions }: TUseOperationPollingQueryOptions = {},
) => {
  const { data, error, isLoading, isError, ...rest } = useQuery({
    queryKey: getOperationQueryKey(projectId, operationId),
    queryFn: () => getOperation(projectId, operationId),
    enabled: !!operationId && enabled,
    ...defaultQueryOptions,
    ...queryOptions,
  });

  useEffect(() => {
    if (isLoading || !operationId) return undefined;
    if (error) {
      return onError?.();
    }
    return data && onSuccess?.(data);
  }, [data, error, isLoading, operationId, onSuccess, onError]);

  return { data, isLoading, isError, error, ...rest };
};

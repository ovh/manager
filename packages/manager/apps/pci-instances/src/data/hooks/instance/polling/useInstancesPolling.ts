import {
  DefaultError,
  Query,
  useQueries,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { getInstance } from '@/data/api/instance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { instancesQueryKey, isApiErrorResponse } from '@/utils';
import { TInstance } from '@/types/instance/entity.type';

export type TUseInstancesPollingQueryOptions = Pick<
  UseQueryOptions<TInstance>,
  'refetchInterval' | 'gcTime' | 'refetchIntervalInBackground' | 'retry'
>;

export type TUseInstancesPollingCallbacks = {
  onError?: (error: ApiError, pendingTaskId: string) => void;
  onSuccess?: (data: TInstance | undefined) => void;
};

export type TUseInstancesPolling = {
  id: string;
  error: Error | null;
  isLoading: boolean;
  data?: TInstance;
};

export type TPendingTask = {
  instanceId: string;
  region: string;
};

const defaultQueryOptions: TUseInstancesPollingQueryOptions = {
  refetchIntervalInBackground: true,
  gcTime: 0,
  refetchInterval: (query: Query<TInstance>) =>
    query.state.error ? false : 3_000,
};

export const shouldRetryAfterNot404Error = (
  failureCount: number,
  error: DefaultError,
): boolean =>
  isApiErrorResponse(error) && error.response?.status === 404
    ? false
    : failureCount < 3;

export const useInstancesPolling = (
  pendingTasks: TPendingTask[],
  { onError, onSuccess }: TUseInstancesPollingCallbacks = {},
  options?: TUseInstancesPollingQueryOptions,
): TUseInstancesPolling[] => {
  const projectId = useProjectId();
  const queryOptions = options ?? {};

  const polledInstances = useQueries({
    queries: pendingTasks.map(({ instanceId, region }) => ({
      queryKey: instancesQueryKey(projectId, [
        'region',
        region,
        'instance',
        instanceId,
      ]),
      queryFn: () => getInstance({ projectId, region, instanceId }),
      ...defaultQueryOptions,
      ...queryOptions,
    })),
    combine: useCallback(
      (results: UseQueryResult<TInstance>[]) =>
        results.map(({ data, error, isLoading }, index) => ({
          id: pendingTasks[index]?.instanceId ?? '',
          error,
          isLoading,
          data,
        })),
      [pendingTasks],
    ),
  });

  useEffect(() => {
    polledInstances.forEach(({ id, data, error, isLoading }): void => {
      if (isLoading) return undefined;
      if (error && isApiErrorResponse(error)) {
        return onError?.(error, id);
      }
      return onSuccess?.(data);
    });
  }, [onError, onSuccess, polledInstances]);

  return polledInstances;
};

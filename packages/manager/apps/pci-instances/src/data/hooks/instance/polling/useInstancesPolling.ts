import {
  DefaultError,
  Query,
  useQueries,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { getInstance } from '@/data/api/instance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { instancesQueryKey, isApiErrorResponse } from '@/utils';
import { TInstanceDto } from '@/types/instance/api.type';

export type TUseInstancesPollingQueryOptions = Pick<
  UseQueryOptions<TInstanceDto>,
  'refetchInterval' | 'gcTime' | 'refetchIntervalInBackground' | 'retry'
>;

export type TUseInstancesPollingCallbacks = {
  onError?: (error: ApiError, pendingTaskId: string) => void;
  onSuccess?: (data: TInstanceDto | undefined) => void;
};

const defaultQueryOptions: TUseInstancesPollingQueryOptions = {
  refetchIntervalInBackground: true,
  gcTime: 0,
  refetchInterval: (query: Query<TInstanceDto>) =>
    query.state.error ? false : 3000,
};

export const shouldRetryAfter404Error = (
  failureCount: number,
  error: DefaultError,
): boolean =>
  isApiErrorResponse(error) && error.response?.status === 404
    ? false
    : failureCount < 3;

export const useInstancesPolling = (
  pendingTaskIds: string[],
  { onError, onSuccess }: TUseInstancesPollingCallbacks = {},
  options?: TUseInstancesPollingQueryOptions,
) => {
  const projectId = useProjectId();
  const queryOptions = options ?? {};

  const polledInstances = useQueries({
    queries: pendingTaskIds.map((instanceId) => ({
      queryKey: instancesQueryKey(projectId, ['instance', instanceId]),
      queryFn: () =>
        getInstance({
          projectId,
          instanceId,
        }),
      ...defaultQueryOptions,
      ...queryOptions,
    })),
    combine: useCallback(
      (results: UseQueryResult<TInstanceDto>[]) =>
        results.map(({ data, error, isLoading }, index) => ({
          id: pendingTaskIds[index],
          error,
          isLoading,
          data,
        })),
      [pendingTaskIds],
    ),
  });

  polledInstances.forEach(({ id, data, error, isLoading }): void => {
    if (isLoading) return undefined;
    if (error && isApiErrorResponse(error)) {
      return onError?.(error, id);
    }
    return onSuccess?.(data);
  });

  return polledInstances;
};

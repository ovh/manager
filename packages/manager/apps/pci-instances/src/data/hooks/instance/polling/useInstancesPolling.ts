import {
  DefaultError,
  Query,
  useQueries,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { getRegionInstance } from '@/data/api/instance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { instancesQueryKey, isApiErrorResponse } from '@/utils';
import {
  TBaseInstanceDto,
  TPolledInstanceDto,
} from '@/types/instance/api.type';

export type TUseInstancesPollingQueryOptions = Pick<
  UseQueryOptions<TBaseInstanceDto>,
  'refetchInterval' | 'gcTime' | 'refetchIntervalInBackground' | 'retry'
>;

export type TUseInstancesPollingCallbacks = {
  onError?: (error: ApiError, pendingTaskId: string) => void;
  onSuccess?: (data: TPolledInstanceDto | undefined) => void;
};

type TPendingTask = {
  instanceId: string;
  region: string;
};

const defaultQueryOptions: TUseInstancesPollingQueryOptions = {
  refetchIntervalInBackground: true,
  gcTime: 0,
  refetchInterval: (query: Query<TBaseInstanceDto>) =>
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
  pendingTaskIds: TPendingTask[],
  { onError, onSuccess }: TUseInstancesPollingCallbacks = {},
  options?: TUseInstancesPollingQueryOptions,
) => {
  const projectId = useProjectId();
  const queryOptions = options ?? {};

  const polledInstances = useQueries({
    queries: pendingTaskIds.map(({ instanceId, region }) => ({
      queryKey: instancesQueryKey(projectId, [
        'region',
        region,
        'instance',
        instanceId,
      ]),
      queryFn: () =>
        getRegionInstance({
          projectId,
          region,
          instanceId,
        }),
      select: ({
        id,
        name,
        status,
        actions,
        pendingTask,
        taskState,
      }: TBaseInstanceDto) => ({
        id,
        name,
        status,
        actions,
        pendingTask,
        taskState,
      }),
      ...defaultQueryOptions,
      ...queryOptions,
    })),
    combine: useCallback(
      (results: UseQueryResult<TPolledInstanceDto>[]) =>
        results.map(({ data, error, isLoading }, index) => ({
          id: pendingTaskIds[index].instanceId,
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

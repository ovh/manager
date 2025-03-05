import {
  Query,
  useQueries,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import { getInstance } from '@/data/api/instance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { instancesQueryKey } from '@/utils';
import { TInstanceDto } from '@/types/instance/api.type';

export type TUseInstancesPollingQueryOptions = Pick<
  UseQueryOptions<TInstanceDto>,
  'refetchInterval' | 'gcTime' | 'refetchIntervalInBackground'
>;

export const useInstancesPolling = (
  pendingTaskIds: string[],
  callback: (data?: TInstanceDto) => void,
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
      refetchInterval: (query: Query<TInstanceDto>) =>
        query.state.error ? false : 5000,
      refetchIntervalInBackground: true,
      gcTime: 0,
      ...queryOptions,
    })),
    combine: useCallback(
      (results: UseQueryResult<TInstanceDto>[]) =>
        results.map(({ data, isFetching }, index) => ({
          id: pendingTaskIds[index],
          isFetching,
          data,
        })),
      [pendingTaskIds],
    ),
  });

  polledInstances.forEach(({ data }) => {
    callback(data);
  });

  return polledInstances;
};

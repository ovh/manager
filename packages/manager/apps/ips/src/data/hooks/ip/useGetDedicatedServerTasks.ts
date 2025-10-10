import {
  useQueries,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useMemo } from 'react';
import {
  DedicatedServerTaskResponse,
  getDedicatedServerTask,
  getDedicatedServerTaskQueryKey,
  getDedicatedServerTasks,
  getDedicatedServerTasksQueryKey,
} from '@/data/api';
import {
  INVALIDATED_REFRESH_PERIOD,
  UPDATE_TASKS_QUERY_KEY_PARAMS,
} from '@/utils';

export type UseGetDedicatedServerTasksParams = {
  serviceName: string;
  functionList: string[];
  statusList: string[];
  enabled: boolean;
  queryKeyToInvalidate: string[];
};

function isUpdateTaskStatus(status: string): boolean {
  return !status || UPDATE_TASKS_QUERY_KEY_PARAMS.statusList.includes(status);
}

// Only for dedicated server for now
export const useGetDedicatedServerTasks = ({
  serviceName,
  functionList,
  statusList,
  enabled = true,
  queryKeyToInvalidate,
}: UseGetDedicatedServerTasksParams) => {
  const queryClient = useQueryClient();

  const parameterSets = useMemo(
    () =>
      serviceName
        ? functionList.flatMap((taskFunction) =>
            statusList.map((status) => ({ taskFunction, status, serviceName })),
          )
        : [],
    [],
  );

  const tasksQueriesResult = useQueries({
    queries: parameterSets.map(
      (queryParams): UseQueryOptions<ApiResponse<number[]>, ApiError> => ({
        queryKey: getDedicatedServerTasksQueryKey(queryParams),
        queryFn: () => getDedicatedServerTasks(queryParams),
        retry: false,
        enabled,
      }),
    ),
    combine: (results) => ({
      isPending: results.some((result) => result.isPending),
      isLoading: results.some((result) => result.isLoading),
      error: results.find((result) => result.error),
      data: results.reduce(
        (acc: number[], result) => acc.concat(result.data?.data ?? []),
        [],
      ),
    }),
  });

  const hasOnGoingTaskResult = useQueries({
    queries: tasksQueriesResult.data.map(
      (
        taskId: number,
      ): UseQueryOptions<
        ApiResponse<DedicatedServerTaskResponse>,
        ApiError
      > => ({
        queryKey: getDedicatedServerTaskQueryKey(serviceName, taskId),
        queryFn: () => getDedicatedServerTask(serviceName, taskId),
        retry: false,
        refetchInterval: (query) => {
          if (isUpdateTaskStatus(query.state.data?.data.status)) {
            return INVALIDATED_REFRESH_PERIOD;
          }
          queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
          return undefined;
        },
      }),
    ),
    combine: (results) => ({
      isPending: results.some((result) => result.isPending),
      isLoading: results.some((result) => result.isLoading),
      error: results.find((result) => result.error)?.error,
      data: results.some((result) =>
        isUpdateTaskStatus(result.data?.data.status),
      ),
    }),
  });

  return {
    hasOnGoingTask: !!hasOnGoingTaskResult.data,
  };
};

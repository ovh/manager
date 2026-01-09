import {
  Query,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  DedicatedServerTaskResponse,
  getDedicatedServerTask,
  getDedicatedServerTaskQueryKey,
  getIcebergDedicatedServerTask,
  getIcebergDedicatedServerTasksQueryKey,
} from '@/data/api';
import { IpTypeEnum } from '@/data/constants';
import {
  INVALIDATED_REFRESH_PERIOD,
  UPDATE_TASKS_QUERY_KEY_PARAMS,
  getTypeByServiceName,
} from '@/utils';

export type UseGetDedicatedServerTasksParams = {
  serviceName?: string | null;
  functionList: string[];
  statusList: string[];
  enabled: boolean;
  queryKeyToInvalidate: string[];
};

function isUpdateTaskStatus(status?: string): boolean {
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

  const taskQuery = useQuery<number[], ApiError>({
    queryKey: getIcebergDedicatedServerTasksQueryKey(serviceName),
    queryFn: async () => {
      try {
        const tasks = await getIcebergDedicatedServerTask(serviceName);
        return (
          tasks.data
            ?.filter(
              (task) =>
                functionList.includes(task.function) &&
                statusList.includes(task.status),
            )
            .map((task) => task.taskId) ?? []
        );
      } catch {
        return [];
      }
    },
    retry: false,
    enabled:
      !!serviceName &&
      getTypeByServiceName(serviceName) === IpTypeEnum.DEDICATED &&
      enabled,
  });

  useQueries({
    queries: (taskQuery?.data ?? []).map((taskId: number) => ({
      queryKey: getDedicatedServerTaskQueryKey(serviceName, taskId),
      queryFn: () => getDedicatedServerTask(serviceName, taskId),
      retry: false,
      refetchInterval: (
        query: Query<ApiResponse<DedicatedServerTaskResponse>, ApiError>,
      ) => {
        if (
          !query.state.error &&
          isUpdateTaskStatus(query.state.data?.data?.status)
        ) {
          return INVALIDATED_REFRESH_PERIOD;
        }

        if (query.state.data?.data?.status === 'done') {
          queryClient.setQueryData(
            getIcebergDedicatedServerTasksQueryKey(serviceName),
            (oldData: number[]) =>
              !oldData
                ? oldData
                : oldData.filter((id) => id !== query.state.data?.data?.taskId),
          );
          queryClient.invalidateQueries({
            queryKey: queryKeyToInvalidate,
          });
        }

        return undefined;
      },
    })),
  });

  return {
    isTasksLoading: taskQuery.isLoading,
    taskError: taskQuery.error,
    hasOnGoingTask: taskQuery?.data && taskQuery?.data?.length > 0,
  };
};

import { Query, useQueries, useQuery } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { VrackTask } from '@ovh-ux/manager-network-common';

import { INVALIDATED_REFRESH_PERIOD, PENDING_TASKS_STATUSES } from '@/App.constants';
import { getVrackTaskDetail, getVrackTaskList } from '@/data/api/get/vrackTasks';

function isUpdateTaskStatus(status: string): boolean {
  return !status || PENDING_TASKS_STATUSES.includes(status);
}

export const getVrackTaskListKey = (serviceName: string) => [`/vrack/${serviceName}/task`];

export const getVrackTaskDetailKey = (serviceName: string, taskId: number) => [
  getVrackTaskListKey(serviceName),
  `${taskId}`,
];

export const useGetVrackTasks = ({ serviceName = '' }: { serviceName: string }) => {
  const { data: taskIds } = useQuery({
    queryKey: getVrackTaskListKey(serviceName),
    queryFn: () => getVrackTaskList(serviceName),
    retry: false,
    enabled: serviceName !== '',
  });

  const { data: vrackTasks } = useQueries({
    queries:
      taskIds?.map((taskId) => ({
        queryKey: getVrackTaskDetailKey(serviceName, taskId),
        queryFn: () => getVrackTaskDetail(serviceName, taskId),
        retry: false,
        refetchInterval: (query: Query<ApiResponse<VrackTask>, ApiError>) => {
          if (!query.state.error && isUpdateTaskStatus(query.state.data?.data?.status ?? '')) {
            return INVALIDATED_REFRESH_PERIOD;
          }
          return false;
        },
      })) ?? [],
    combine: (results) => ({
      isError: results?.some((query) => query.isError),
      error: results?.find((query) => query.error)?.error,
      isLoading: results?.some((query) => query.isLoading),
      data: results
        ?.filter(Boolean)
        .filter(
          (query) =>
            isUpdateTaskStatus(query?.data?.data?.status ?? '') && query.error?.status !== 404,
        )
        .map((query) => query?.data?.data)
        .filter((task) => !!task),
    }),
  });

  return { vrackTasks };
};

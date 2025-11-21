import { useGetDedicatedServerTasks } from './useGetDedicatedServerTasks';
import { VMAC_UPDATE_TASKS_QUERY_KEY_PARAMS } from '@/utils';
import { getdedicatedServerVmacQueryKey } from '@/data/api';

export type UseHasVmacTasksParams = {
  serviceName: string;
  enabled?: boolean;
};

// Only for dedicated server for now
export const useHasVmacTasks = ({
  serviceName,
  enabled = true,
}: UseHasVmacTasksParams) => {
  const { hasOnGoingTask: hasVmacTasks } = useGetDedicatedServerTasks({
    ...VMAC_UPDATE_TASKS_QUERY_KEY_PARAMS,
    serviceName,
    enabled,
    queryKeyToInvalidate: getdedicatedServerVmacQueryKey({ serviceName }),
  });

  return {
    hasVmacTasks,
  };
};

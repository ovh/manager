import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FilterComparator } from '@/api/filters';
import { getDedicatedServerTasks } from '@/api/dedicatedServer';

export default function useDedicatedServerTasks(serviceName: string) {
  const queryClient = useQueryClient();
  const { data: pendingTasks, isLoading: isPendingTasksLoading } = useQuery(
    ['dedicated_server_tasks', serviceName],
    async () => {
      const { data } = await getDedicatedServerTasks(serviceName, {
        filters: [
          {
            key: 'status',
            value: ['todo', 'init', 'doing'],
            comparator: FilterComparator.IsIn,
          },
        ],
      });
      return data;
    },
    { staleTime: 5 * 60 * 1000, refetchInterval: 7 * 1000 },
  );

  return {
    isPendingTasksLoading,
    pendingTasks,
    reload: () =>
      queryClient.invalidateQueries(['dedicated_server_tasks', serviceName]),
  };
}

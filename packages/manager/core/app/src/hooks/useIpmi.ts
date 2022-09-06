import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FilterComparator } from '@/api/filters';
import { dedicatedServerIpmiTest } from '@/api/dedicatedServer';

export default function useIpmi(serviceName: string) {
  const queryClient = useQueryClient();

  const { data: pendingTasks, isLoading: isPendingTasksLoading } = useQuery(
    ['dedicated_server_tasks', serviceName],
    () => dedicatedServerIpmiTest(serviceName, 5, 'http'),
  );

  return {
    test: () => {},
  };
}

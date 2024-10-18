import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { usePlatform, useOrganization } from '@/hooks';
import {
  getZimbraPlatformTask,
  getZimbraPlatformTaskQueryKey,
  TaskType,
} from '@/api/task';

type UseTasksParams = Omit<UseQueryOptions, 'queryKey' | 'queryFn' | 'select'>;

export const useTasks = (options: UseTasksParams = {}) => {
  const { platformId } = usePlatform();
  const { data: organization } = useOrganization();

  return useQuery({
    ...options,
    queryKey: getZimbraPlatformTaskQueryKey(platformId, organization?.id),
    queryFn: () => getZimbraPlatformTask(platformId, organization?.id),
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!platformId,
  }) as UseQueryResult<TaskType[]>;
};

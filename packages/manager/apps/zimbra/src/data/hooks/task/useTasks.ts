import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useOrganization } from '@/data/hooks';
import {
  getZimbraPlatformTask,
  getZimbraPlatformTaskQueryKey,
  TaskType,
} from '@/data/api';

type UseTasksParams = Omit<UseQueryOptions, 'queryKey' | 'queryFn' | 'select'>;

export const useTasks = (options: UseTasksParams = {}) => {
  const { platformId } = useParams();
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

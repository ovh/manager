import { useParams } from 'react-router-dom';

import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { TaskType, getZimbraPlatformTask, getZimbraPlatformTaskQueryKey } from '@/data/api';
import { useOrganization } from '@/data/hooks';

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
        : typeof options.enabled !== 'boolean' || options.enabled) && !!platformId,
  }) as UseQueryResult<TaskType[]>;
};

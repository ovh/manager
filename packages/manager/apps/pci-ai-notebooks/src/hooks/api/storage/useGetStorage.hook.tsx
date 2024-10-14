import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import * as storage from '@/types/cloud/storage';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { getStorage } from '@/data/api/storage/storage.api';

export function useGetStorage(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'storage'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getStorage({ projectId }),
    ...options,
  }) as UseQueryResult<storage.Container[], Error>;
}

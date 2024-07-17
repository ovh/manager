import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import { getNotebooks } from '@/data/api/ai/notebook.api';
import { ai } from '@/types/ai';

export function useGetNotebooks(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'notebook'];
  return useQuery({
    queryKey,
    queryFn: () => getNotebooks({ projectId }),
    ...options,
  }) as UseQueryResult<ai.notebook.Notebook[], Error>;
}

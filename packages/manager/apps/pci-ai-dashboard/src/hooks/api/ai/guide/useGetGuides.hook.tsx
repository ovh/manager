import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { getGuides } from '@/data/api/ai/guide.api';
import * as ai from '@/types/cloud/project/ai';

export function useGetGuides(
  projectId: string,
  section?: string,
  lang?: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'guides', section];
  return useQuery({
    queryKey,
    queryFn: () =>
      getGuides({
        projectId,
        section,
        lang,
      }),
    ...options,
  }) as UseQueryResult<ai.Guide[], Error>;
}

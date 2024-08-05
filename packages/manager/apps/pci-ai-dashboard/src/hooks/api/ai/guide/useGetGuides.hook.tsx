import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getGuides } from '@/data/api/ai/guide.api';
import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch.hook';

export function useGetGuides(
  projectId: string,
  section?: string,
  lang?: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'guides', section];
  return useQueryImmediateRefetch({
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

import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getGuides } from '@/data/api/ai/guides/guide.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import { Guide } from '@/types/Guides';

export function useGetGuides(
  projectId: string,
  section?: string[],
  lang?: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'guides', section, lang];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getGuides({
        projectId,
        section,
        lang,
      }),
    ...options,
  }) as UseQueryResult<Guide[], Error>;
}

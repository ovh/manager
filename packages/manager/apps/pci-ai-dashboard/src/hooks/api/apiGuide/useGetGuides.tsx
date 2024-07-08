import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { getGuides } from '@/data/api/apiGuide';
import { Guide } from '@/types/guide';

export function useGetGuides(
  projectId: string,
  section?: string,
  lang?: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'guides', section, lang];
  return useQuery({
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

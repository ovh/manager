import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getGuides } from '@/data/api/guides/guides.api';
import { Guide } from '@/types/guide';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

export function useGetGuides(
  section?: string,
  lang?: string,
  engines?: string[],
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = ['guides/cloud/databases', section, lang, engines];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getGuides({
        section,
        engines,
        lang,
      }),
    ...options,
  }) as UseQueryResult<Guide[], Error>;
}

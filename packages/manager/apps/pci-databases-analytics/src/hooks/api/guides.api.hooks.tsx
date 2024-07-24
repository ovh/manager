import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getGuides } from '@/api/databases/guides';
import { Guide } from '@/models/guide';
import { useQueryImmediateRefetch } from './useImmediateRefetch';

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

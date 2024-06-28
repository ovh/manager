import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { getGuides } from '@/data/api/guides';
import { Guide } from '@/types/guide';

export function useGetGuides(
  section?: string,
  lang?: string,
  engines?: string[],
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = ['guides/cloud/databases', section, lang, engines];
  return useQuery({
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

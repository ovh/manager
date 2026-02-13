import { getGuides } from '@/data/api/guides/guides.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/data/hooks/useImmediateRefetch.hook';

export function useGetGuides(
  section?: string,
  lang?: string,
  engines?: string[],
  options?: OptionsFor<typeof getGuides>,
) {
  const queryKey = ['guides/cloud/databases', section, lang, engines.join(',')];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getGuides({
        section,
        engines,
        lang,
      }),
    ...options,
  });
}

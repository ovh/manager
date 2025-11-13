import { getRegions } from '@/data/api/region/region.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';

export function useGetRegions(
  projectId: string,
  options?: OptionsFor<typeof getRegions>,
) {
  const queryKey = [projectId, 'region'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getRegions({ projectId }),
    ...options,
  });
}

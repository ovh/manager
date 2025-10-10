import { getRegionsCapabilities } from '@/data/api/database/capabilities.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '../../useImmediateRefetch';

export function useGetRegionsCapabilities(
  projectId: string,
  options?: OptionsFor<typeof getRegionsCapabilities>,
) {
  const queryKey = [projectId, 'database/capabilities/regions'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getRegionsCapabilities(projectId),
    ...options,
  });
}

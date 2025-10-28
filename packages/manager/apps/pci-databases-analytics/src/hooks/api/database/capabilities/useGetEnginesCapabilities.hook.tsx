import { getEnginesCapabilities } from '@/data/api/database/capabilities.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '../../useImmediateRefetch';

export function useGetEnginesCapabilities(
  projectId: string,
  options?: OptionsFor<typeof getEnginesCapabilities>,
) {
  const queryKey = [projectId, 'database/capabilities/engines'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getEnginesCapabilities(projectId),
    ...options,
  });
}

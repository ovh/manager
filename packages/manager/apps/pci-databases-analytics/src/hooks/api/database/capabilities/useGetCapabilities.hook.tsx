import { getCapabilities } from '@/data/api/database/capabilities.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '../../useImmediateRefetch';

export function useGetCapabilities(
  projectId: string,
  options?: OptionsFor<typeof getCapabilities>,
) {
  const queryKey = [projectId, 'database/capabilities'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getCapabilities(projectId),
    ...options,
  });
}

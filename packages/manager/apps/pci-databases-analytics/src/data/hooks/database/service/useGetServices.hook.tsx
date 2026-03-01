import { getServices } from '@/data/api/database/service.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/data/hooks/useImmediateRefetch.hook';

export function useGetServices(
  projectId: string,
  options?: OptionsFor<typeof getServices>,
) {
  const queryKey = [projectId, 'database/service'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getServices({ projectId }),
    ...options,
  });
}

import { getSwiftStorage } from '@/data/api/storage/swiftStorage.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';

export function useGetSwift(
  projectId: string,
  containerId: string,
  noObjects: boolean,
  options?: OptionsFor<typeof getSwiftStorage>,
) {
  const queryKey = [projectId, 'storages', containerId];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getSwiftStorage({ projectId, containerId, noObjects }),
    ...options,
  });
}

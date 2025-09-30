import { getSwiftStorage } from '@/data/api/storage/swiftStorage.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';

export type UseGetSwiftProps = {
  projectId: string;
  containerId: string;
  noObjects: boolean;
  options?: OptionsFor<typeof getSwiftStorage>;
};

export function useGetSwift({
  projectId,
  containerId,
  noObjects,
  options,
}: UseGetSwiftProps) {
  const queryKey = [projectId, 'storages', containerId];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getSwiftStorage({ projectId, containerId, noObjects }),
    ...options,
  });
}

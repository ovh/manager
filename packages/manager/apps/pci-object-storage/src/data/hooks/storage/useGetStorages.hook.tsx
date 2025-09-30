import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';
import { getStorages } from '../../api/storage/storages.api';

export function useGetStorages(
  projectId: string,
  options?: OptionsFor<typeof getStorages>,
) {
  const queryKey = [projectId, 'storages'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getStorages({ projectId, archive: false, withObjects: true }),
    ...options,
  });
}

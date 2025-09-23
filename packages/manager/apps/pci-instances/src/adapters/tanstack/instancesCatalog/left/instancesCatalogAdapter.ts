import queryClient from '@/queryClient';
import { instancesCatalogQueryKey } from '../queryKeys';
import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';
import { InstancesCatalogPort } from '@/domain/port/instancesCatalog/left/port';

export const instancesCatalogAdapter: InstancesCatalogPort = {
  selectInstancesCatalog: (projectId: string) =>
    queryClient.getQueryData<TInstancesCatalog>(
      instancesCatalogQueryKey(projectId),
    ),
};

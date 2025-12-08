import queryClient from '@/queryClient';
import { instancesCatalogQueryKey } from '../queryKeys';
import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';
import { TInstancesCatalogPort } from '@/domain/port/instancesCatalog/left/port';

export const instancesCatalogAdapter: TInstancesCatalogPort = {
  selectInstancesCatalog: (projectId: string) =>
    queryClient.getQueryData<TInstancesCatalog>(
      instancesCatalogQueryKey(projectId),
    ),
};

import type { TFileCatalog, } from '@/domain/entities/catalog.entity';
import queryClient from '@/QueryClient';
import { TFileCatalogPort } from '@/domain/ports/catalog/left/port';
import { shareCatalogQueryKey } from '@/adapters/catalog/queryKeys';

export const fileCatalogAdapter :TFileCatalogPort = {
  selectFileCatalog: (projectId: string) =>
    queryClient.getQueryData<TFileCatalog>(
      shareCatalogQueryKey(projectId),
    ),
};


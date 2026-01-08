import { TFileCatalog } from '@/domain/entities/catalog.entity';

export type TFileCatalogPort = {
  selectFileCatalog: (projectId: string) => TFileCatalog | undefined;
};

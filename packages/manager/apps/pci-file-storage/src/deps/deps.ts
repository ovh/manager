import { TFileCatalogPort } from '@/domain/ports/catalog/left/port';
import { fileCatalogAdapter } from '@/adapters/catalog/left/fileCatalog.adapter';

export type Deps = {
  fileCatalogPort: TFileCatalogPort;
};

export const deps: Deps = {
  fileCatalogPort: fileCatalogAdapter,
};



import { instancesCatalogAdapter } from '@/adapters/tanstack/instancesCatalog/left/instancesCatalogAdapter';
import { TInstancesCatalogPort } from '@/domain/port/instancesCatalog/left/port';
import { TInstancePort } from '@/domain/port/instance/port';
import { instanceAdapter } from '@/adapters/tanstack/instances/right/instanceAdapter';

export type Deps = {
  instancesCatalogPort: TInstancesCatalogPort;
  instancePort: TInstancePort;
};

export const deps: Deps = {
  instancesCatalogPort: instancesCatalogAdapter,
  instancePort: instanceAdapter,
};

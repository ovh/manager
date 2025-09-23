import { instancesCatalogAdapter } from '@/adapters/tanstack/instancesCatalog/left/instancesCatalogAdapter';
import { InstancesCatalogPort } from '@/domain/port/instancesCatalog/left/port';
import i18next from 'i18next';

export type Deps = {
  instancesCatalogPort: InstancesCatalogPort;
  translate: (key: string) => string;
};

export const deps: Deps = {
  instancesCatalogPort: instancesCatalogAdapter,
  translate: i18next.t,
};

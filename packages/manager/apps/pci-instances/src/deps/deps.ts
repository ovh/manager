import { instancesCatalogAdapter } from '@/adapters/tanstack/instancesCatalog/left/instancesCatalogAdapter';
import { InstancesCatalogPort } from '@/domain/port/instancesCatalog/left/port';
import { i18nInstance } from '@/main';

export type TTranslateFn = (key: string) => string;

export type Deps = {
  instancesCatalogPort: InstancesCatalogPort;
  translate: TTranslateFn;
};

export const deps: Deps = {
  instancesCatalogPort: instancesCatalogAdapter,
  translate: i18nInstance.t,
};

import { instancesCatalogAdapter } from '@/adapters/tanstack/instancesCatalog/left/instancesCatalogAdapter';
import { InstancesCatalogPort } from '@/domain/port/instancesCatalog/left/port';
import { ConfigurationPort } from '@/domain/port/configuration/left/port';
import { configurationAdapter } from '@/adapters/tanstack/configuration/left/configurationAdapter';

export type Deps = {
  instancesCatalogPort: InstancesCatalogPort;
  configurationPort: ConfigurationPort;
};

export const deps: Deps = {
  instancesCatalogPort: instancesCatalogAdapter,
  configurationPort: configurationAdapter,
};

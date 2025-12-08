import { instancesCatalogAdapter } from '@/adapters/tanstack/instancesCatalog/left/instancesCatalogAdapter';
import { TInstancesCatalogPort } from '@/domain/port/instancesCatalog/left/port';
import { TConfigurationPort } from '@/domain/port/configuration/left/port';
import { configurationAdapter } from '@/adapters/tanstack/configuration/left/configurationAdapter';
import { TInstancePort } from '@/domain/port/instance/port';
import { instanceAdapter } from '@/adapters/tanstack/instance/left/instanceAdapter';

export type Deps = {
  instancesCatalogPort: TInstancesCatalogPort;
  configurationPort: TConfigurationPort;
  instancePort: TInstancePort;
};

export const deps: Deps = {
  instancesCatalogPort: instancesCatalogAdapter,
  configurationPort: configurationAdapter,
  instancePort: instanceAdapter,
};

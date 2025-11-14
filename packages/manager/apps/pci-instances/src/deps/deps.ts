import { i18nMessageProvider } from '@/adapters/i18n/left/i18nMessageProvider';
import { instancesCatalogAdapter } from '@/adapters/tanstack/instancesCatalog/left/instancesCatalogAdapter';
import { InstancesCatalogPort } from '@/domain/port/instancesCatalog/left/port';
import { ConfigurationPort } from '@/domain/port/configuration/left/port';
import { MessageProviderPort } from '@/domain/port/messageProvider/left/port';
import { configurationAdapter } from '@/adapters/tanstack/configuration/left/configurationAdapter';

export type Deps = {
  instancesCatalogPort: InstancesCatalogPort;
  configurationPort: ConfigurationPort;
  messageProviderPort: MessageProviderPort;
};

export const deps: Deps = {
  instancesCatalogPort: instancesCatalogAdapter,
  configurationPort: configurationAdapter,
  messageProviderPort: i18nMessageProvider,
};

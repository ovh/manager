import { i18nMessageProvider } from '@/adapters/i18n/left/i18nMessageProvider';
import { instancesCatalogAdapter } from '@/adapters/tanstack/instancesCatalog/left/instancesCatalogAdapter';
import { InstancesCatalogPort } from '@/domain/port/instancesCatalog/left/port';
import { MessageProviderPort } from '@/domain/port/messageProvider/left/port';

export type Deps = {
  instancesCatalogPort: InstancesCatalogPort;
  messageProviderPort: MessageProviderPort;
};

export const deps: Deps = {
  instancesCatalogPort: instancesCatalogAdapter,
  messageProviderPort: i18nMessageProvider,
};

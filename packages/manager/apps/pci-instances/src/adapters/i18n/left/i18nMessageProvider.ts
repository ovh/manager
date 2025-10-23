import { MessageProviderPort } from '@/domain/port/messageProvider/left/port';
import { i18nInstance } from '@/main';

export const i18nMessageProvider: MessageProviderPort = {
  getMessage: (key: string) => i18nInstance.t(key),
};

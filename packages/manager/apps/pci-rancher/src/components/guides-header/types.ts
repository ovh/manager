import { Subsidiary } from '@ovh-ux/manager-config';

export type Guide = {
  key: string;
  url: GuideLinksDefault;
  tracking?: string;
};

export type GuideLinks = Partial<Record<Subsidiary, string>>;
export type GuideLinksDefault = GuideLinks & Record<'DEFAULT', string>;

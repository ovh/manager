import type { Subsidiary } from '@ovh-ux/manager-config';

export type HelpLocale =
  | 'de'
  | 'es'
  | 'fr'
  | 'en'
  | 'en-gb'
  | 'en-ie'
  | 'it'
  | 'fr-ma'
  | 'pl'
  | 'pt'
  | 'fr-sn'
  | 'fr-tn'
  | 'asia'
  | 'en-au'
  | 'en-ca'
  | 'fr-ca'
  | 'en-sg';

export type HelpLocalesBySubsidiary = Partial<Record<Subsidiary, HelpLocale>>;

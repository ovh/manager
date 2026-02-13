import { LanguageOption } from '@/data/hooks/settings/useSettings';
import {
  WEBSITE_LABEL_BY_LOCALE,
  WEBSITE_LABEL_BY_LOCALE_OVERWRITES,
} from './settings.constants';
import { Subsidiary } from '@ovh-ux/manager-config';

export const getWebsiteLabel = (language: LanguageOption): string =>
  (language.ovhSubsidiary &&
    WEBSITE_LABEL_BY_LOCALE_OVERWRITES[language.ovhSubsidiary as Subsidiary]?.[
      language.ietfLanguageTag
    ]) ??
  WEBSITE_LABEL_BY_LOCALE[language.ietfLanguageTag];

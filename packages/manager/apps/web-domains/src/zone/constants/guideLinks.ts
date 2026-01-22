import { Subsidiary } from '@ovh-ux/manager-config';
import { useMemo } from 'react';
import {
  Languages as BaseLanguages,
  buildLinksByLanguage,
  type GuideConfig,
} from '@/domain/constants/guideLinks';

export const Languages = {
  ...BaseLanguages,
  AU: 'en-au',
  IE: 'en-ie',
} as const;

export enum GuideNameEnum {
  DNS_ZONE = 'DNS_ZONE',
  DNS_HISTORY = 'DNS_HISTORY',
}

export type ZoneLanguageKey = keyof typeof Languages;

const guides: Record<GuideNameEnum, GuideConfig> = {
  [GuideNameEnum.DNS_ZONE]: {
    type: 'article',
    target: '-dns-edit-dns-zone',
    articles: {
      DEFAULT: 'KB0051682',
      ASIA: 'KB0039681',
      AU: 'KB0051673',
      CA: 'KB0051675',
      DE: 'KB0051668',
      ES: 'KB0051692',
      FR: 'KB0051684',
      GB: 'KB0039608',
      IE: 'KB0051685',
      IN: 'KB0069751',
      IT: 'KB0051687',
      LT: 'KB0051685',
      MA: 'KB0051684',
      NL: 'KB0051682',
      PL: 'KB0051689',
      PT: 'KB0051694',
      QC: 'KB0051686',
      SG: 'KB0051681',
      SN: 'KB0051684',
      TN: 'KB0051684',
    } as Record<ZoneLanguageKey, string>,
  },
  [GuideNameEnum.DNS_HISTORY]: {
    type: 'article',
    target: 'fr-dns-zone-history',
    articles: {
      DEFAULT: 'KB0051682',
      ASIA: 'KB0061053',
      AU: 'KB0061043',
      CA: 'KB0061050',
      DE: 'KB0061048',
      ES: 'KB0061051',
      FR: 'KB0061056',
      GB: 'KB0061045',
      IE: 'KB0061055',
      IN: 'KB0069739',
      IT: 'KB0061049',
      LT: 'KB0061044',
      MA: 'KB0061056',
      NL: 'KB0051682',
      PL: 'KB0061052',
      PT: 'KB0061047',
      QC: 'KB0061057',
      SG: 'KB0061054',
      SN: 'KB0061056',
      TN: 'KB0061056',
    } as Record<ZoneLanguageKey, string>,
  },
};

export const LINKS_BY_LANGUAGE = buildLinksByLanguage(
  guides,
  Languages,
) as Record<ZoneLanguageKey, Record<GuideNameEnum, string>>;

export const useZoneLinks = (
  language: Subsidiary,
): Record<GuideNameEnum, string> =>
  useMemo(
    () =>
      LINKS_BY_LANGUAGE[language as ZoneLanguageKey] ||
      LINKS_BY_LANGUAGE.DEFAULT,
    [language],
  );

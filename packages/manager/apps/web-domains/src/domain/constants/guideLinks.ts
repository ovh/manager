import { Subsidiary } from '@ovh-ux/manager-config';
import { useMemo } from 'react';

export enum GuideNameEnum {
  DOMAINS_LINK = 'DOMAINS_LINK',
  HOST_LINK = 'HOST_LINK',
  MODIFY_DNS_LINK = 'MODIFY_DNS_LINK',
  MANUAL_RENEW_LINK = 'MANUAL_RENEW_LINK',
  TRANSFER_LINK = 'TRANSFER_LINK',
  ORDER_API_LINK = 'ORDER_API_LINK',
  FAQ_LINK = 'FAQ_LINK',
}

const helpRoot = 'https://help.ovhcloud.com/csm/';

export interface Links {
  [key: string]: string;
  DEFAULT: string;
  ASIA?: string;
  CA?: string;
  DE?: string;
  ES?: string;
  FR?: string;
  GB?: string;
  IE?: string; // same as DEFAULT generally
  IN?: string;
  IT?: string;
  LT?: string;
  MA?: string;
  NL?: string;
  PL?: string;
  PT?: string;
  QC?: string;
  SG?: string;
  SN?: string;
  TN?: string;
}

export const Languages = {
  DEFAULT: 'en-ie',
  ASIA: 'asia',
  CA: 'en-ca',
  DE: 'de',
  ES: 'es-es',
  FR: 'fr',
  GB: 'en-gb',
  IN: 'en-in',
  IT: 'it',
  LT: 'es',
  MA: 'fr',
  NL: 'en-ie',
  PL: 'pl',
  PT: 'pt',
  QC: 'fr-ca',
  SG: 'en-sg',
  SN: 'fr',
  TN: 'fr',
} as const;

export type LanguageKey = keyof typeof Languages;
type ArticleGuide = {
  type: 'article';
  target: string;
  articles: Record<LanguageKey, string>;
};
type CategoryGuide = {
  type: 'category';
  suffix: string;
};
type GuideConfig = ArticleGuide | CategoryGuide;

const guides: Record<GuideNameEnum, GuideConfig> = {
  [GuideNameEnum.DOMAINS_LINK]: {
    type: 'category',
    suffix:
      '-documentation-web-cloud-domains?id=kb_browse_cat&kb_id=e17b4f25551974502d4c6e78b7421955&kb_category=54441955f49801102d4ca4d466a7fdb2',
  },
  [GuideNameEnum.HOST_LINK]: {
    type: 'article',
    target: '-dns-glue-registry',
    articles: {
      DEFAULT: 'KB0051745',
      ASIA: 'KB0039681',
      CA: 'KB0051746',
      DE: 'KB0051751',
      ES: 'KB0051755',
      FR: 'KB0051754',
      GB: 'KB0051749',
      IN: 'KB0069751',
      IT: 'KB0051762',
      LT: 'KB0051758',
      MA: 'KB0051754',
      NL: 'KB0051745',
      PL: 'KB0051761',
      PT: 'KB0051753',
      QC: 'KB0051752',
      SG: 'KB0051747',
      SN: 'KB0051754',
      TN: 'KB0051754',
    },
  },
  [GuideNameEnum.MODIFY_DNS_LINK]: {
    type: 'article',
    target: '-dns-servers-edit',
    articles: {
      DEFAULT: 'KB0063603',
      ASIA: 'KB0063601',
      CA: 'KB0063613',
      DE: 'KB0063611',
      ES: 'KB0063604',
      FR: 'KB0063455',
      GB: 'KB0063607',
      IN: 'KB0069726',
      IT: 'KB0063610',
      LT: 'KB0063599',
      MA: 'KB0063455',
      NL: 'KB0063603',
      PL: 'KB0063600',
      PT: 'KB0063598',
      QC: 'KB0063453',
      SG: 'KB0063612',
      SN: 'KB0063455',
      TN: 'KB0063455',
    },
  },
  [GuideNameEnum.MANUAL_RENEW_LINK]: {
    type: 'article',
    target: '-billing-automatic-renewal',
    articles: {
      DEFAULT: 'KB0029780',
      ASIA: 'KB0042824',
      CA: 'KB0042827',
      DE: 'KB0042837',
      ES: 'KB0042847',
      FR: 'KB0042839',
      GB: 'KB0042838',
      IN: 'KB0067855',
      IT: 'KB0042846',
      LT: 'KB0042849',
      MA: 'KB0042839',
      NL: 'KB0029780',
      PL: 'KB0042841',
      PT: 'KB0042842',
      QC: 'KB0042845',
      SG: 'KB0042840',
      SN: 'KB0042839',
      TN: 'KB0042839',
    },
  },
  [GuideNameEnum.TRANSFER_LINK]: {
    type: 'article',
    target: '-domain-names-transfer-generic-domain',
    articles: {
      DEFAULT: 'KB0039746',
      ASIA: 'KB0051804',
      CA: 'KB0051807',
      DE: 'KB0051806',
      ES: 'KB0051816',
      FR: 'KB0051808',
      GB: 'KB0051799',
      IN: 'KB0069758',
      IT: 'KB0051809',
      LT: 'KB0051800',
      MA: 'KB0051808',
      NL: 'KB0039746',
      PL: 'KB0051818',
      PT: 'KB0051819',
      QC: 'KB0051817',
      SG: 'KB0051810',
      SN: 'KB0051808',
      TN: 'KB0051808',
    },
  },
  [GuideNameEnum.ORDER_API_LINK]: {
    type: 'article',
    target: '-domain-names-api-order',
    articles: {
      DEFAULT: 'KB0051562',
      ASIA: 'KB0039482',
      CA: 'KB0051558',
      DE: 'KB0051556',
      ES: 'KB0051564',
      FR: 'KB0051566',
      GB: 'KB0051560',
      IN: 'KB0069711',
      IT: 'KB0051570',
      LT: 'KB0051569',
      MA: 'KB0051566',
      NL: 'KB0051562',
      PL: 'KB0051567',
      PT: 'KB0051568',
      QC: 'KB0051565',
      SG: 'KB0051571',
      SN: 'KB0051566',
      TN: 'KB0051566',
    },
  },
  [GuideNameEnum.FAQ_LINK]: {
    type: 'article',
    target: '-domain-names-faq',
    articles: {
      DEFAULT: 'KB0072951',
      ASIA: 'KB0072954',
      CA: 'KB0072950',
      DE: 'KB0072949',
      ES: 'KB0072952',
      FR: 'KB0072959',
      GB: 'KB0072955',
      IN: 'KB0072956',
      IT: 'KB0072960',
      LT: 'KB0072947',
      MA: 'KB0072959',
      NL: 'KB0072951',
      PL: 'KB0072946',
      PT: 'KB0072948',
      QC: 'KB0072961',
      SG: 'KB0072958',
      SN: 'KB0072959',
      TN: 'KB0072959',
    },
  },
};

const buildLinksByLanguage = (
  guides: Record<GuideNameEnum, GuideConfig>,
): Record<string, Record<GuideNameEnum, string>> =>
  Object.fromEntries(
    (Object.keys(Languages) as LanguageKey[]).map((lang) => {
      const urls: Record<GuideNameEnum, string> = {} as Record<
        GuideNameEnum,
        string
      >;
      for (const [guideKey, config] of Object.entries(guides)) {
        if (config.type === 'category') {
          urls[
            guideKey as GuideNameEnum
          ] = `${helpRoot}${Languages[lang]}${config.suffix}`;
        } else {
          urls[guideKey as GuideNameEnum] =
            `${helpRoot}${Languages[lang]}${config.target}?id=kb_article_view&sysparm_article=` +
            (config.articles[lang] ?? config.articles.DEFAULT);
        }
      }
      return [lang, urls];
    }),
  ) as Record<LanguageKey, Record<GuideNameEnum, string>>;
export const LINKS_BY_LANGUAGE = buildLinksByLanguage(guides);

export const useLinks = (language: Subsidiary): Record<GuideNameEnum, string> =>
  useMemo(() => LINKS_BY_LANGUAGE[language] || LINKS_BY_LANGUAGE.DEFAULT, [
    language,
  ]);

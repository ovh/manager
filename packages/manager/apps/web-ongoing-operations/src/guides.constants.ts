export type LangCode =
  | 'FR'
  | 'EN'
  | 'DE'
  | 'ES'
  | 'IT'
  | 'PL'
  | 'PT'
  | 'DEFAULT';

export type GuideLinks = Record<LangCode, string>;
export interface Guide {
  key: string;
  url: GuideLinks;
}

const helpRoot = 'https://help.ovhcloud.com/csm/';

const baseGuideUrl = `${helpRoot}{{lang}}-documentation-web-cloud-domains-domain-names?id=kb_browse_cat&kb_id=e17b4f25551974502d4c6e78b7421955&kb_category=50441955f49801102d4ca4d466a7fdc2&spa=1`;

export const WEB_ONGOING_OPERATIONS_DOMAINS: GuideLinks = {
  FR: baseGuideUrl.replace('{{lang}}', 'fr'),
  EN: baseGuideUrl.replace('{{lang}}', 'en-gb'),
  DE: baseGuideUrl.replace('{{lang}}', 'de'),
  ES: baseGuideUrl.replace('{{lang}}', 'es-es'),
  IT: baseGuideUrl.replace('{{lang}}', 'it'),
  PL: baseGuideUrl.replace('{{lang}}', 'pl'),
  PT: baseGuideUrl.replace('{{lang}}', 'pt'),
  DEFAULT: baseGuideUrl.replace('{{lang}}', 'fr'),
};

export const GUIDES_LIST = {
  domains: {
    key: 'web_ongoing_operations_domains',
    url: WEB_ONGOING_OPERATIONS_DOMAINS,
  },
};

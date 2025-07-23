import { generateGuideLinks } from '@/domain/utils/generateGuideLinks';

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

const baseGuideUrl = `${helpRoot}{{lang}}-documentation-web-cloud-domains?id=kb_browse_cat&kb_id=e17b4f25551974502d4c6e78b7421955&kb_category=54441955f49801102d4ca4d466a7fdb2`;
const modifyDnsGuideUrl = `${helpRoot}{{lang}}-dns-servers-edit?id=kb_article_view&sysparm_article=KB0063455`;

export const WEB_DOMAINS = generateGuideLinks(baseGuideUrl);
export const MODIFY_DNS = generateGuideLinks(modifyDnsGuideUrl);

export const GUIDES_LIST = {
  domains: {
    key: 'web_domains',
    url: WEB_DOMAINS,
  },
  modifyDns: {
    key: 'modify_dns',
    url: MODIFY_DNS,
  },
};

export const PREDEFINED_SUBDOMAIN = ['mail', 'webmail', 'exchange', 'connect'];

export const MULTI_PART_TLDS = [
  'co.uk',
  'com.au',
  'com.br',
  'com.cn',
  'com.mx',
  'com.es',
];

const PREFIX_GUIDES_URL = 'https://help.ovhcloud.com/csm/';

export const MIGRATE_DOMAIN_TO_OVHCLOUD_GUIDE = {
  DEFAULT: `${PREFIX_GUIDES_URL}en-ie-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0039746`,
  ASIA: `${PREFIX_GUIDES_URL}asia-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051804`,
  DE: `${PREFIX_GUIDES_URL}de-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051806`,
  ES: `${PREFIX_GUIDES_URL}es-es-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051816`,
  IE: `${PREFIX_GUIDES_URL}en-ie-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0039746`,
  IT: `${PREFIX_GUIDES_URL}it-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051809`,
  PL: `${PREFIX_GUIDES_URL}pl-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051818`,
  PT: `${PREFIX_GUIDES_URL}pt-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051819`,
  GB: `${PREFIX_GUIDES_URL}en-gb-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051799`,
  CA: `${PREFIX_GUIDES_URL}en-ca-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051807`,
  QC: `${PREFIX_GUIDES_URL}fr-ca-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051817`,
  MA: `${PREFIX_GUIDES_URL}fr-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051808`,
  SN: `${PREFIX_GUIDES_URL}fr-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051808`,
  TN: `${PREFIX_GUIDES_URL}fr-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051808`,
  AU: `${PREFIX_GUIDES_URL}en-au-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051802`,
  IN: `${PREFIX_GUIDES_URL}en-in-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0069758`,
  SG: `${PREFIX_GUIDES_URL}en-sg-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051810`,
  FR: `${PREFIX_GUIDES_URL}fr-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051808`,
  WE: `${PREFIX_GUIDES_URL}en-ie-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0039746`,
  WS: `${PREFIX_GUIDES_URL}es-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051800`,
};

export default {
  PREDEFINED_SUBDOMAIN,
  MULTI_PART_TLDS,
  MIGRATE_DOMAIN_TO_OVHCLOUD_GUIDE,
};

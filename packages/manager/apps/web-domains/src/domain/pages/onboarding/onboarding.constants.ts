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

const websiteRoot = 'https://www.ovhcloud.com/';
const domainWebsite = '/domains/';
export const ORDER_LINK = '?#/webCloud/domain/select?selection=~()';

const guideUrl = 'https://help.ovhcloud.com/csm/';

export const WEBSITE_LINK: Links = {
  DEFAULT: `${websiteRoot}en-ie${domainWebsite}`,
  ASIA: `${websiteRoot}asia${domainWebsite}`,
  CA: `${websiteRoot}en-ca${domainWebsite}`,
  DE: `${websiteRoot}de${domainWebsite}`,
  ES: `${websiteRoot}es-es${domainWebsite}`,
  FR: `${websiteRoot}fr${domainWebsite}`,
  GB: `${websiteRoot}en-gb${domainWebsite}`,
  IN: `${websiteRoot}en-in${domainWebsite}`,
  IT: `${websiteRoot}it${domainWebsite}`,
  LT: `${websiteRoot}es${domainWebsite}`,
  MA: `${websiteRoot}fr-ma${domainWebsite}`,
  NL: `${websiteRoot}nl${domainWebsite}`,
  PL: `${websiteRoot}pl${domainWebsite}`,
  PT: `${websiteRoot}pt${domainWebsite}`,
  QC: `${websiteRoot}fr-ca${domainWebsite}`,
  SG: `${websiteRoot}en-sg${domainWebsite}`,
  SN: `${websiteRoot}fr-sn${domainWebsite}`,
  TN: `${websiteRoot}fr-tn${domainWebsite}`,
};

export const TRANSFER_LINK: Links = {
  DEFAULT: `${guideUrl}en-ie-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0039746`,
  ASIA: `${guideUrl}asia-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051804`,
  CA: `${guideUrl}en-ca-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051807`,
  DE: `${guideUrl}de-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051806`,
  ES: `${guideUrl}es-es-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051816`,
  FR: `${guideUrl}fr-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051808`,
  GB: `${guideUrl}en-gb-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051799`,
  IN: `${guideUrl}en-in-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0069758`,
  IT: `${guideUrl}it-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051809`,
  LT: `${guideUrl}es-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051800`,
  MA: `${guideUrl}fr-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051808`,
  PL: `${guideUrl}pl-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051818`,
  PT: `${guideUrl}pt-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051819`,
  QC: `${guideUrl}fr-ca-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051817`,
  SG: `${guideUrl}en-sg-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051810`,
  SN: `${guideUrl}fr-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051808`,
  TN: `${guideUrl}fr-domain-names-transfer-generic-domain?id=kb_article_view&sysparm_article=KB0051808`,
};

export const ORDER_API_LINK: Links = {
  DEFAULT: `${guideUrl}en-ie-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051562`,
  ASIA: `${guideUrl}asia-domain-names-api-order?id=kb_article_view&sysparm_article=KB0039482`,
  CA: `${guideUrl}en-ca-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051558`,
  DE: `${guideUrl}de-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051556`,
  ES: `${guideUrl}es-es-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051564`,
  FR: `${guideUrl}fr-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051566`,
  GB: `${guideUrl}en-gb-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051560`,
  IN: `${guideUrl}en-in-domain-names-api-order?id=kb_article_view&sysparm_article=KB0069711`,
  IT: `${guideUrl}it-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051570`,
  LT: `${guideUrl}es-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051569`,
  MA: `${guideUrl}fr-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051566`,
  NL: `${guideUrl}en-ie-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051562`,
  PL: `${guideUrl}pl-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051567`,
  PT: `${guideUrl}pt-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051568`,
  QC: `${guideUrl}fr-ca-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051565`,
  SG: `${guideUrl}en-sg-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051571`,
  SN: `${guideUrl}fr-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051566`,
  TN: `${guideUrl}fr-domain-names-api-order?id=kb_article_view&sysparm_article=KB0051566`,
};

export const FAQ_LINK: Links = {
  DEFAULT: `${guideUrl}en-ie-domain-names-faq?id=kb_article_view&sysparm_article=KB0072951`,
  ASIA: `${guideUrl}asia-domain-names-faq?id=kb_article_view&sysparm_article=KB0072954`,
  CA: `${guideUrl}en-ca-domain-names-faq?id=kb_article_view&sysparm_article=KB0072950`,
  DE: `${guideUrl}de-domain-names-faq?id=kb_article_view&sysparm_article=KB0072949`,
  ES: `${guideUrl}es-es-domain-names-faq?id=kb_article_view&sysparm_article=KB0072952`,
  FR: `${guideUrl}fr-domain-names-faq?id=kb_article_view&sysparm_article=KB0072959`,
  GB: `${guideUrl}en-gb-domain-names-faq?id=kb_article_view&sysparm_article=KB0072955`,
  IN: `${guideUrl}en-in-domain-names-faq?id=kb_article_view&sysparm_article=KB0072956`,
  IT: `${guideUrl}it-domain-names-faq?id=kb_article_view&sysparm_article=KB0072960`,
  LT: `${guideUrl}es-domain-names-faq?id=kb_article_view&sysparm_article=KB0072947`,
  MA: `${guideUrl}fr-domain-names-faq?id=kb_article_view&sysparm_article=KB0072959`,
  NL: `${guideUrl}en-ie-domain-names-faq?id=kb_article_view&sysparm_article=KB0072951`,
  PL: `${guideUrl}pl-domain-names-faq?id=kb_article_view&sysparm_article=KB0072946`,
  PT: `${guideUrl}pt-domain-names-faq?id=kb_article_view&sysparm_article=KB0072948`,
  QC: `${guideUrl}fr-ca-domain-names-faq?id=kb_article_view&sysparm_article=KB0072961`,
  SG: `${guideUrl}en-sg-domain-names-faq?id=kb_article_view&sysparm_article=KB0072958`,
  SN: `${guideUrl}fr-domain-names-faq?id=kb_article_view&sysparm_article=KB0072959`,
  TN: `${guideUrl}fr-domain-names-faq?id=kb_article_view&sysparm_article=KB0072959`,
};

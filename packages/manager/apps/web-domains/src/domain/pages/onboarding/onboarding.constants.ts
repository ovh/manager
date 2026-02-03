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

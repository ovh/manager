export interface Links {
  [key: string]: string;
  DEFAULT: string;
  FR?: string;
  GB?: string;
  DE?: string;
  ES?: string;
  IT?: string;
  NL?: string;
  PL?: string;
  PT?: string;
  IE?: string;
  MA?: string;
  TN?: string;
  SN?: string;
  IN?: string;
}

const websiteRoot = 'https://www.ovhcloud.com/';
const zimbraWebsite = '/emails/zimbra-emails/';

export const WEBSITE_LINK: Links = {
  FR: `${websiteRoot}fr${zimbraWebsite}`,
  GB: `${websiteRoot}en-gb${zimbraWebsite}`,
  DE: `${websiteRoot}de${zimbraWebsite}`,
  ES: `${websiteRoot}es-es${zimbraWebsite}`,
  IT: `${websiteRoot}it${zimbraWebsite}`,
  NL: `${websiteRoot}nl${zimbraWebsite}`,
  PL: `${websiteRoot}pl${zimbraWebsite}`,
  PT: `${websiteRoot}pt-pt${zimbraWebsite}`,
  IE: `${websiteRoot}en-ie${zimbraWebsite}`,
  DEFAULT: `${websiteRoot}en-ie${zimbraWebsite}`,
  MA: `${websiteRoot}fr-ma${zimbraWebsite}`,
  TN: `${websiteRoot}fr-tn${zimbraWebsite}`,
  SN: `${websiteRoot}fr-sn${zimbraWebsite}`,
};

export const ORDER_LINK =
  "?zimbra#/webCloud/zimbra/select?selection=~(zimbra~(offer~'zimbra-account-pp-starter~pricing~'default~quantity~1))";

export default {
  WEBSITE_LINK,
  ORDER_LINK,
};

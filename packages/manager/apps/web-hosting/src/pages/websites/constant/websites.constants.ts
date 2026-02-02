const websiteRoot = 'https://www.ovhcloud.com/';
const webSitePath = '/web-hosting/create-your-website/';
const helpRoot = 'https://help.ovhcloud.com/csm/';
const guideRoot =
  '-documentation-web-cloud-hosting?id=kb_browse_cat&kb_id=e17b4f25551974502d4c6e78b7421955&kb_category=98441955f49801102d4ca4d466a7fdb2';

export const GUIDE_URL: Record<string, string> = {
  DEFAULT: `${helpRoot}en-ie${guideRoot}`,
  FR: `${helpRoot}fr${guideRoot}`,
  DE: `${helpRoot}de${guideRoot}`,
  ES: `${helpRoot}es${guideRoot}`,
  IE: `${helpRoot}en-ie${guideRoot}`,
  IT: `${helpRoot}it${guideRoot}`,
  NL: `${helpRoot}en-ie${guideRoot}`,
  PL: `${helpRoot}en-ie${guideRoot}`,
  PT: `${helpRoot}pt${guideRoot}`,
  GB: `${helpRoot}en-gb${guideRoot}`,
  MA: `${helpRoot}fr-ma${guideRoot}`,
  SN: `${helpRoot}fr-sn${guideRoot}`,
  TN: `${helpRoot}fr-tn${guideRoot}`,
};
export const ORDER_URL: Record<string, string> = {
  DEFAULT: `${websiteRoot}en-ie${webSitePath}`,
  IN: `${websiteRoot}en-in${webSitePath}`,
  DE: `${websiteRoot}de${webSitePath}`,
  ES: `${websiteRoot}es-es${webSitePath}`,
  IE: `${websiteRoot}en-ie${webSitePath}`,
  IT: `${websiteRoot}it${webSitePath}`,
  NL: `${websiteRoot}nl${webSitePath}`,
  PL: `${websiteRoot}pl${webSitePath}`,
  PT: `${websiteRoot}pt${webSitePath}`,
  GB: `${websiteRoot}en-gb${webSitePath}`,
  CA: `${websiteRoot}en-ca${webSitePath}`,
  QC: `${websiteRoot}fr-ca${webSitePath}`,
  MA: `${websiteRoot}fr-ma${webSitePath}`,
  SN: `${websiteRoot}fr-sn${webSitePath}`,
  TN: `${websiteRoot}fr-tn${webSitePath}`,
  AU: `${websiteRoot}en-au${webSitePath}`,
  SG: `${websiteRoot}en-sg${webSitePath}`,
  FR: `${websiteRoot}fr${webSitePath}`,
  WE: `${websiteRoot}en${webSitePath}`,
  WS: `${websiteRoot}es${webSitePath}`,
  ASIA: `${websiteRoot}asia${webSitePath}`,
};

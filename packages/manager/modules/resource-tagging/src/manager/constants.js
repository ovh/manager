const getGuideLink = (language, article) =>
  `https://help.ovhcloud.com/csm/${language}-dedicated-servers-resource-tag-assign?id=kb_article_view&sysparm_article=${article}`;

export const TAGS_GUIDE_LINKS = {
  DE: getGuideLink('de', 'KB0071261'),
  ES: getGuideLink('es-es', 'KB0071251'),
  FR: getGuideLink('fr', 'KB0071263'),
  IE: getGuideLink('en-ie', 'KB0071254'),
  IT: getGuideLink('it', 'KB0071256'),
  NL: getGuideLink('en-ie', 'KB0071254'),
  PL: getGuideLink('pl', 'KB0071249'),
  PT: getGuideLink('pt', 'KB0071255'),
  GB: getGuideLink('en-gb', 'KB0071258'),
  CA: getGuideLink('en-ca', 'KB0071259'),
  QC: getGuideLink('fr-ca', 'KB0071250'),
  MA: getGuideLink('fr', 'KB0071263'),
  SN: getGuideLink('fr', 'KB0071263'),
  TN: getGuideLink('fr', 'KB0071263'),
  AU: getGuideLink('en-au', 'KB0071253'),
  IN: getGuideLink('asia', 'KB0071264'),
  SG: getGuideLink('en-ie', 'KB0071254'),
  ASIA: getGuideLink('asia', 'KB0071264'),
  WE: getGuideLink('en-ie', 'KB0071254'),
  WS: getGuideLink('es', 'KB0071260'),
  DEFAULT: getGuideLink('en-ie', 'KB0071254'),
};

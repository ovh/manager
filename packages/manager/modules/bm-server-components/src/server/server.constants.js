export const NO_AUTORENEW_COUNTRIES = [
  'CZ',
  'PL',
  'CA',
  'US',
  'WS',
  'MA',
  'TN',
  'SN',
];

export const DC_2_ISO = {
  BHS: 'CA',
  DC: 'CA',
  ERI: 'GB',
  GRA: 'FR',
  GSW: 'FR',
  HIL: 'US',
  LIM: 'DE',
  P: 'FR',
  RBX: 'FR',
  SBG: 'FR',
  SGP: 'SG',
  SYD: 'AU',
  VIN: 'US',
  WAW: 'PL',
  YNM: 'IN',
};

export const NEW_RANGE = {
  PATTERN: /^(ADV|STOR|ADVANCE|RISE|INFRA|SCALE|HGR-HCI|HGR-STOR|HGR-SDS|HGR-AI)(-STOR)?-[1-9](-GEN[1-9]|-SE|LE)?$/,
};

export const SERVICE_TYPE = 'DEDICATED_SERVER';

export const TAG_TAB_LABEL = 'Tags';
export const BETA_LABEL = 'Beta';

export const GAME_DDOS_GUIDE_URL = (language, article) =>
  `https://help.ovhcloud.com/csm/${language}-dedicated-servers-game-ddos-firewall?id=kb_article_view&sysparm_article=${article}`;

const frParams = ['fr', 'KB0060685'];
const enIeParams = ['en-ie', 'KB0060676'];

export const GAME_DDOS_GUIDE_PARAMS = {
  FR: frParams,
  DE: ['de', 'KB0060678'],
  ES: ['es-es', 'KB0060679'],
  IE: enIeParams,
  IT: ['it', 'KB0060681'],
  NL: enIeParams,
  PL: ['pl', 'KB0060682'],
  PT: ['pt', 'KB0060674'],
  GB: ['en-gb', 'KB0060687'],
  CA: ['en-ca', 'KB0060683'],
  QC: ['fr-ca', 'KB0060688'],
  US: ['en-gb', 'KB0060687'],
  MA: frParams,
  SN: frParams,
  TN: frParams,
  AU: ['en-au', 'KB0060684'],
  IN: ['en-in', 'KB0067917'],
  SG: ['en-sg', 'KB0060675'],
  ASIA: ['asia', 'KB0060686'],
  WE: enIeParams,
  WS: enIeParams,
  DEFAULT: enIeParams,
};

export default {
  DC_2_ISO,
  NEW_RANGE,
  NO_AUTORENEW_COUNTRIES,
  SERVICE_TYPE,
  TAG_TAB_LABEL,
  BETA_LABEL,
};

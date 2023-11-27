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

export const BYOI_STATUS_ENUM = {
  DOING: 'doing',
  DONE: 'done',
  ERROR: 'error',
};

export const BYOI_STARTING_MESSAGE = 'starting';

export const SERVICE_TYPE = 'DEDICATED_SERVER';

export default {
  DC_2_ISO,
  BYOI_STARTING_MESSAGE,
  BYOI_STATUS_ENUM,
  NEW_RANGE,
  NO_AUTORENEW_COUNTRIES,
  SERVICE_TYPE,
};

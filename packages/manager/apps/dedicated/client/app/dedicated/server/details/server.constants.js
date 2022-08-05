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

export const GUIDES_FIREWALL_CISCO_ASA_EOL = {
  fr_FR: 'https://docs.ovh.com/fr/dedicated/cisco-asa-eol/',
  default: 'https://docs.ovh.com/gb/en/dedicated/cisco-asa-eol/',
};

export default {
  BYOI_STARTING_MESSAGE,
  BYOI_STATUS_ENUM,
  GUIDES_FIREWALL_CISCO_ASA_EOL,
  NEW_RANGE,
  NO_AUTORENEW_COUNTRIES,
  SERVICE_TYPE,
};

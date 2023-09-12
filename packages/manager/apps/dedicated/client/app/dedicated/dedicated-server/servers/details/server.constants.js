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

export const OPERATING_SYSTEM_ENUM = {
  NONE_64: 'none_64',
  NONE_32: 'none_32',
  BRING_YOUR_OWN_IMAGE: 'byoi_32',
};

export default {
  BYOI_STARTING_MESSAGE,
  BYOI_STATUS_ENUM,
  NEW_RANGE,
  NO_AUTORENEW_COUNTRIES,
  SERVICE_TYPE,
};

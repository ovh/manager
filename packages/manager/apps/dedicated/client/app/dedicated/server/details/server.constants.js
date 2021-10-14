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
  PATTERN: /^(ADV|STOR|ADVANCE|RISE|INFRA|SCALE|HGR-HCI|HGR-STOR|HGR-SDS|HGR-AI)(-STOR)?-[1-9](-GEN[1-9]|-SE)?$/,
};

export const BYOI_STATUS_ENUM = {
  DOING: 'doing',
  DONE: 'done',
  ERROR: 'error',
};

export const BYOI_STARTING_MESSAGE = 'starting';

export default {
  BYOI_STARTING_MESSAGE,
  BYOI_STATUS_ENUM,
  NEW_RANGE,
  NO_AUTORENEW_COUNTRIES,
};

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

export const SERVICE_TYPE = 'DEDICATED_SERVER';

export default {
  NEW_RANGE,
  NO_AUTORENEW_COUNTRIES,
  SERVICE_TYPE,
};

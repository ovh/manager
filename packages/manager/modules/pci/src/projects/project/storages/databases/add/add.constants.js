export const NAME_PATTERN = /^([\w.-]*)$/;
export const MIN_NAME_LENGTH = 3;
export const MAX_NAME_LENGTH = 40;
export const ORDER_KEYS = [
  'description',
  'nodesPattern.flavor',
  'nodesPattern.number',
  'nodesPattern.region',
  'plan',
  'version',
  'networkId',
  'subnetId',
];

export default {
  NAME_PATTERN,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  ORDER_KEYS,
};

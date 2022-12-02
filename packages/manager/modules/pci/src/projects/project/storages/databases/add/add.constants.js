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
export const PRIVATE_NETWORK_GUIDE = {
  DEFAULT: 'https://docs.ovh.com/gb/en/public-cloud/public-cloud-vrack/',
  ASIA: 'https://docs.ovh.com/asia/en/public-cloud/public-cloud-vrack/',
  AU: 'https://docs.ovh.com/au/en/public-cloud/public-cloud-vrack/',
  CA: 'https://docs.ovh.com/ca/en/public-cloud/public-cloud-vrack/',
  FR: 'https://docs.ovh.com/fr/public-cloud/public-cloud-vrack/',
  GB: 'https://docs.ovh.com/gb/en/public-cloud/public-cloud-vrack/',
  IE: 'https://docs.ovh.com/ie/en/public-cloud/public-cloud-vrack/',
  QC: 'https://docs.ovh.com/ca/fr/public-cloud/public-cloud-vrack/',
  SG: 'https://docs.ovh.com/sg/en/public-cloud/public-cloud-vrack/',
};

export default {
  NAME_PATTERN,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  ORDER_KEYS,
  PRIVATE_NETWORK_GUIDE,
};

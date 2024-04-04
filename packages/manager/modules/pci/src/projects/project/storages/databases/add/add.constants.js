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
  'disk.size',
  'networkId',
  'subnetId',
];
export const ORDER_KEYS_TERRAFORM = [
  'service_name',
  'description',
  'engine',
  'version',
  'plan',
  'flavor',
  'disk_size',
  'nodes',
  'nodes.region',
  'nodes.network_id',
  'nodes.subnet_id',
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
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/360002093130-Configuring-vRack-for-Public-Cloud',
};

export const DATABASE_ENGINES = [
  'cassandra',
  'grafana',
  'kafka',
  'kafkaConnect',
  'kafkaMirrorMaker',
  'm3aggregator',
  'm3db',
  'mongodb',
  'mysql',
  'opensearch',
  'postgresql',
  'redis',
];

export const URL_MODEL = {
  e: {
    name: 'engineName',
    type: String,
    validate: (value) => DATABASE_ENGINES.includes(value),
    value: null,
  },
};

export default {
  NAME_PATTERN,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  ORDER_KEYS,
  ORDER_KEYS_TERRAFORM,
  PRIVATE_NETWORK_GUIDE,
  DATABASE_ENGINES,
  URL_MODEL,
};

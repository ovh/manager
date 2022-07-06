export const PUBLIC_GATEWAYS_READ_MORE_GUIDE = {
  ALL_GUIDE: {
    DEFAULT:
      'https://docs.ovh.com/gb/en/public-cloud/creating-private-network-with-gateway/',
  },
};

export const REGIONS_AVAILABILITY_URL =
  'https://www.ovhcloud.com/en-ie/public-cloud/regions-availability/';

export const AVAILABLE_SUBNET = [
  '192.168.0.1/24',
  '10.0.0.1/24',
  '172.16.0.1/24',
];

export const PRODUCT_NAME = 'GATEWAY';
export const DEFAULT_IPVERSION = 4;

export const DEFAULTS_MODEL = [
  {
    fields: [
      {
        name: 'region',
        model: 'selectedRegion',
        availableOptions: 'regions',
        getDefault: (defaultValue, availableOptions) =>
          availableOptions.find((option) => option.name === defaultValue),
        onChange: 'onRegionChange',
        onChangeParams: ['selectedRegion'],
      },
    ],
  },
  {
    fields: [
      {
        name: 'network',
        model: 'selectedPrivateNetwork',
        availableOptions: 'privateNetworks',
        getDefault: (defaultValue, availableOptions) =>
          availableOptions.find((option) => option.id === defaultValue),
        onChange: 'onPrivateNetworkChange',
        onChangeParams: ['selectedPrivateNetwork'],
      },
    ],
  },
];

export default {
  PUBLIC_GATEWAYS_READ_MORE_GUIDE,
  REGIONS_AVAILABILITY_URL,
  PRODUCT_NAME,
  DEFAULT_IPVERSION,
};

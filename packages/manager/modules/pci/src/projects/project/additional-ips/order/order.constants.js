export const ORDER_URL = {
  EU: 'https://www.ovh.com/order/express/#/express/review?products=',
  CA: 'https://ca.ovh.com/order/express/#/express/review?products=',
  US: 'https://us.ovhcloud.com/order/express/#/express/review?products=',
};

export const GUIDE_URLS = {
  FAILOVER_IP: {
    DEFAULT: 'https://www.ovhcloud.com/en/bare-metal/ip/',
  },
  CONF_FAILOVER_IP: {
    FR: 'https://docs.ovh.com/fr/public-cloud/configurer_une_ip_failover/',
    DEFAULT:
      'https://docs.ovh.com/gb/en/public-cloud/make-failover-ip-configuration-persistent/',
  },
  REGIONS_AVAILABILITY: {
    FR: 'https://www.ovhcloud.com/fr/public-cloud/regions-availability/',
    DE: 'https://www.ovhcloud.com/de/public-cloud/regions-availability/',
    ES: 'https://www.ovhcloud.com/es-es/public-cloud/regions-availability/',
    IT: 'https://www.ovhcloud.com/it/public-cloud/regions-availability/',
    NL: 'https://www.ovhcloud.com/nl/public-cloud/regions-availability/',
    PL: 'https://www.ovhcloud.com/pl/public-cloud/regions-availability/',
    PT: 'https://www.ovhcloud.com/pt/public-cloud/regions-availability/',
    GB: 'https://www.ovhcloud.com/en-gb/public-cloud/regions-availability/',
    CA: 'https://www.ovhcloud.com/en-ca/public-cloud/regions-availability/',
    QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/regions-availability/',
    AU: 'https://www.ovhcloud.com/en-au/public-cloud/regions-availability/',
    SG: 'https://www.ovhcloud.com/en-sg/public-cloud/regions-availability/',
    DEFAULT:
      'https://www.ovhcloud.com/en-ie/public-cloud/regions-availability/',
  },
};

export const IP_TYPE_ENUM = {
  FAILOVER: 'failover_ip',
  FLOATING: 'floating_ip',
};

export const REGIONS = {
  EU: 'EUROPE',
  CA: 'CANADA',
  US: 'USA',
};

export const DEFAULTS_MODEL = [
  {
    fields: [
      {
        name: 'ipType',
        model: 'selectedIpType',
        availableOptions: 'ipTypes',
        getDefault: (defaultValue, availableOptions) =>
          availableOptions.find((option) => option.name === defaultValue),
        onChange: 'onProductChange',
        onChangeParams: ['selectedIpType'],
      },
    ],
  },
  {
    fields: [
      {
        name: 'region',
        model: 'ip.region',
        availableOptions: 'regions',
        getDefault: (defaultValue, availableOptions) =>
          availableOptions.find((option) => option.name === defaultValue),
        onChange: 'onRegionChange',
        onChangeParams: ['ip.region'],
      },
    ],
  },
  {
    fields: [
      {
        name: 'instance',
        model: 'ip.instance',
        availableOptions: 'filteredInstances',
        getDefault: (defaultValue, availableOptions) =>
          availableOptions.find((option) => option.id === defaultValue),
        onChange: 'instanceChange',
        onChangeParams: ['ip.instance'],
      },
    ],
  },
];

export const GATEWAY_TRACKING_PREFIX =
  'PublicCloud::additional-ips-order::floating-ips-warning-banner';

export default {
  ORDER_URL,
  IP_TYPE_ENUM,
  REGIONS,
  GUIDE_URLS,
  GATEWAY_TRACKING_PREFIX,
};

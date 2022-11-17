export const DEDICATED_CLOUD_DATACENTER = {
  alertId: 'dedicatedCloudDatacenterAlert',
  elementTypes: {
    host: {
      planFamily: 'host-hourly',
    },
    datastore: {
      planFamily: 'datastore-hourly',
    },
  },
};

export const COMMERCIAL_RANGE_NAME_EOL = [
  'dedicated_cloud_2016',
  'cdi_2018',
  'legacy',
];

export const VDC_MIRGRATION_GUIDE_LINK = {
  FR: 'https://docs.ovh.com/fr/private-cloud/vdc-migration/',
  DEFAULT: 'https://docs.ovh.com/gb/en/private-cloud/vdc-migration/',
};

export const PRICE_LINK = {
  DEFAULT:
    'https://www.ovhcloud.com/en-gb/enterprise/products/hosted-private-cloud/prices/',
  FR:
    'https://www.ovhcloud.com/fr/enterprise/products/hosted-private-cloud/prices/',
  IE:
    'https://www.ovhcloud.com/en-ie/enterprise/products/hosted-private-cloud/prices/',
  ES:
    'https://www.ovhcloud.com/es-es/enterprise/products/hosted-private-cloud/prices/',
  NL:
    'https://www.ovhcloud.com/nl/enterprise/products/hosted-private-cloud/prices/',
  IT:
    'https://www.ovhcloud.com/it/enterprise/products/hosted-private-cloud/prices/',
  PL:
    'https://www.ovhcloud.com/pl/enterprise/products/hosted-private-cloud/prices/',
  PT:
    'https://www.ovhcloud.com/pt/enterprise/products/hosted-private-cloud/prices/',
  GB:
    'https://www.ovhcloud.com/en-gb/enterprise/products/hosted-private-cloud/prices/',
  WE:
    'https://www.ovhcloud.com/en/enterprise/products/hosted-private-cloud/prices/',
  US:
    'https://us.ovhcloud.com/enterprise/products/hosted-private-cloud/prices/',
};

export default {
  DEDICATED_CLOUD_DATACENTER,
  COMMERCIAL_RANGE_NAME_EOL,
  VDC_MIRGRATION_GUIDE_LINK,
  PRICE_LINK,
};

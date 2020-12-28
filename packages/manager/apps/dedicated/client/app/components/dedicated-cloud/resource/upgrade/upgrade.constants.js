export const ORDER_PARAMETERS = {
  duration: 'P1M',
  pricingModePrefix: 'pcc-servicepack-',
  productId: 'privateCloud',
  configurationItemLabels: {
    datacenterId: 'datacenter_id',
    hourlyId: 'hourly_id',
  },
};

export const RESOURCE_BILLING_TYPES = {
  hourly: 'HOURLY',
  monthly: 'MONTHLY',
  freeSpare: 'FREE_SPARE',
};

export const RESOURCE_UPGRADE_TYPES = {
  datastore: 'datastore',
  host: 'host',
};

export default {
  ORDER_PARAMETERS,
  RESOURCE_BILLING_TYPES,
  RESOURCE_UPGRADE_TYPES,
};

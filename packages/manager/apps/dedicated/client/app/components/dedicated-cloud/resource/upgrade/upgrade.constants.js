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
  hourly: 'hourly',
  monthly: 'monthly',
  freeSpare: 'freeSpare',
};

export const RESOURCE_BILLING_2API_TYPES = {
  hourly: 'HOURLY',
  monthly: 'MONTHLY',
  freeSpare: 'FREE_SPARE',
};

export const RESOURCE_STATES = {
  delivered: 'delivered',
};

export const RESOURCE_UPGRADE_TYPES = {
  datastore: 'datastore',
  host: 'host',
};

export default {
  ORDER_PARAMETERS,
  RESOURCE_BILLING_TYPES,
  RESOURCE_STATES,
  RESOURCE_UPGRADE_TYPES,
};

export const PRODUCT_ID = 'f4a53r9w';

export const PREFIX_TRACKING_ORDER = 'order';

export const PREFIX_TRACKING_ORDER_NEXT_STEP = {
  diskType: 'add_type',
  capacity: 'add_size',
  datacenter: 'add_region',
  commitment: 'add_commitment',
};

export const FORMAT_DURATION_TRACKING_ORDER = {
  interval: {
    P1M: '1m',
    P12M: '12m',
    P24M: '24m',
    P36M: '36m',
  },
  unit: {
    monthly: 'monthly',
    yearly: 'yearly',
  },
};

export const FORMAT_UNIT_CAPACITY_TRACKING_ORDER = 'tb';

export default {
  FORMAT_DURATION_TRACKING_ORDER,
  FORMAT_UNIT_CAPACITY_TRACKING_ORDER,
  PREFIX_TRACKING_ORDER,
  PREFIX_TRACKING_ORDER_NEXT_STEP,
  PRODUCT_ID,
};

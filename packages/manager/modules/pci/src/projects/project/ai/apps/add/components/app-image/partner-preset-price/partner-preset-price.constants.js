export const PRICES_CONFIG = {
  'per-app': {
    starting: true,
    multiplier: 60,
    unit: 'per_hour_per_app',
  },
  'per-resource': {
    starting: true,
    multiplier: 60,
    unit: 'per_hour_per_resource',
  },
  'per-replica': {
    starting: true,
    multiplier: 60,
    unit: 'per_hour_per_replica',
  },
  'per-second-bracket': {
    starting: false,
    multiplier: 3600,
    unit: 'per_hour_per_unit',
  },
  free: {
    starting: false,
    multiplier: 0,
    unit: 'free',
  },
  default: {
    starting: true,
    multiplier: 60,
    unit: 'per_hour',
  },
};

export default {
  PRICES_CONFIG,
};

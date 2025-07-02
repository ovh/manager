export const DATABASE_MONITORING_COLOR_CHARTS = {
  allowed: {
    bg: 'rgba(0,106,130, .4)',
    border: '#006A82',
  },
  denied: {
    bg: 'rgba(218,59,58, .4)',
    border: '#DA3B3A',
  },
  default: {
    bg: 'rgba(234,247,255, .4)',
    border: '#00748E',
  },
};

export const DATABASE_MONITORING_AGGREGATE_MODES = [
  { label: 'ALL' },
  { label: 'NONE', isDefault: true },
];

export const DATABASE_MONITORING_PERIODS = [
  {
    label: 'DAILY',
    value: '1d',
    step: '15m',
    rawStep: 15,
    timeRange: -24 * 60 * 60 * 1000,
  },
  {
    label: 'WEEKLY',
    value: '7d',
    step: '15m',
    rawStep: 15,
    timeRange: -7 * 24 * 60 * 60 * 1000,
    isDefault: true,
  },
  {
    label: 'MONTHLY',
    value: '30d',
    step: '15m',
    rawStep: 15,
    timeRange: -1 * 30 * 24 * 60 * 60 * 1000,
  },
  {
    label: 'YEARLY',
    value: '365d',
    step: '60m',
    rawStep: 60,
    timeRange: -365 * 24 * 60 * 60 * 1000,
  },
];

export default {
  DATABASE_MONITORING_COLOR_CHARTS,
  DATABASE_MONITORING_PERIODS,
  DATABASE_MONITORING_AGGREGATE_MODES,
};

export const COMMITMENT_PERIODS = [
  {
    months: 1,
    duration: 'P1M',
  },
  {
    months: 3,
    duration: 'P3M',
  },
  {
    months: 6,
    duration: 'P6M',
  },
  {
    months: 12,
    duration: 'P12M',
  },
];
export const PAYMENT_TYPES = [
  {
    name: 'monthly',
    monthly: true,
    mode: 'monthly',
  },
  {
    name: 'one_time',
    monthly: false,
    mode: 'default',
  },
];

export default {
  COMMITMENT_PERIODS,
  PAYMENT_TYPES,
};

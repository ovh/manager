export const PRICING_MODES = {
  DEFAULT: 'default',
  DEGRESSIVITY: 'degressivity',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  UPFRONT: 'upfront',
};

export const PRICING_PERIODS = {
  '12': PRICING_MODES.YEARLY,
  '1': PRICING_MODES.MONTHLY,
};

const LE_16 = 'le-16';
const LE_4 = 'le-4';
const LE_2 = 'le-2';
export const LE_RANGES = [LE_2, LE_4, LE_16];

export const RANGES = {
  BESTVALUE: 'bv',
  COMFORT: 'Comfort',
  ESSENTIAL: 'Essential',
  ELITE: 'Elite',
  STARTER: 'Starter',
  VALUE: 'Value',
  LE_2,
  LE_4,
  LE_16,
};

export const UPSCALE_TRACKING_PREFIX = 'vps::detail::upscale-step-';

export default {
  PRICING_MODES,
  RANGES,
  LE_RANGES,
  PRICING_PERIODS,
  UPSCALE_TRACKING_PREFIX,
};

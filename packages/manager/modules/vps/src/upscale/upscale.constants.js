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

const MODEL_2025_1 = '2025-model1';
const MODEL_2025_2 = '2025-model2';
const MODEL_2025_3 = '2025-model3';
const MODEL_2025_4 = '2025-model4';
const MODEL_2025_5 = '2025-model5';
const MODEL_2025_6 = '2025-model6';

export const RANGES_2025 = [
  MODEL_2025_1,
  MODEL_2025_2,
  MODEL_2025_3,
  MODEL_2025_4,
  MODEL_2025_5,
  MODEL_2025_6,
];

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
  MODEL_2025_1,
  MODEL_2025_2,
  MODEL_2025_3,
  MODEL_2025_4,
  MODEL_2025_5,
  MODEL_2025_6,
};

export const UPSCALE_TRACKING_PREFIX = 'vps::detail::upscale-step-';

export default {
  PRICING_MODES,
  RANGES,
  LE_RANGES,
  RANGES_2025,
  PRICING_PERIODS,
  UPSCALE_TRACKING_PREFIX,
};

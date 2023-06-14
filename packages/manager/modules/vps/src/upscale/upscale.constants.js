export const PRICING_MODES = {
  DEFAULT: 'default',
  DEGRESSIVITY: 'degressivity',
  MONTHLY: 'monthly',
  UPFRONT: 'upfront',
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

export default { PRICING_MODES, RANGES, LE_RANGES };

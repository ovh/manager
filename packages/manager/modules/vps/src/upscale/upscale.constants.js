export const PRICING_MODES = {
  DEFAULT: 'default',
  DEGRESSIVITY: 'degressivity',
  MONTHLY: 'monthly',
  UPFRONT: 'upfront',
};

export const RANGES = {
  BESTVALUE: 'bv',
  COMFORT: 'Comfort',
  ESSENTIAL: 'Essential',
  ELITE: 'Elite',
  STARTER: 'Starter',
  VALUE: 'Value',
};

export const UPSCALE_TYPE_PATH = {
  vCore: 'cpu.cores',
  memory: 'memory.size',
  storage: 'storage.disks[0].capacity',
};

export default { PRICING_MODES, RANGES, UPSCALE_TYPE_PATH };

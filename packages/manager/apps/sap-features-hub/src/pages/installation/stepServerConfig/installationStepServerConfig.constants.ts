export const SERVER_CONFIG_PATTERNS = {
  vmName: /^[a-zA-Z0-9]([\w-]{1,62})[a-zA-Z0-9]$/,
  rootPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^$\\"'`]{8,128}$/,
  instanceNumber: /^\d{2}$/,
};

export const SERVER_CONFIG_LIMITS = {
  vmMax: 12,
  vmNameMinLength: 3,
  vmNameMaxLength: 64,
  vmMaxVcpu: 192,
  vmMaxRam: 4096,
  vmHanaMinVcpu: 8,
  vmHanaMinRam: 64,
  vmApplicationMinVcpu: 1,
  vmApplicationMinRam: 1,
  instanceNumberLength: 2,
  rootPasswordMinLength: 8,
  rootPasswordMaxLength: 128,
};

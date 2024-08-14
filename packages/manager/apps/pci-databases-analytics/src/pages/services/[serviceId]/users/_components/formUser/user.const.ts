export const USER_CONFIG = {
  name: {
    min: 3,
    max: 32,
    pattern: /^\w[\w.-]*$/,
  },
  group: {
    min: 1,
    max: 16,
    pattern: /^\w[\w.-]*$/,
  },
  roles: {
    customTag: '(defined db)',
    customInput: {
      min: 1,
      max: 32,
    },
  },
  keys: {
    min: 1,
    max: 254,
    pattern: /^\S{1,254}$/,
  },
  categories: {
    min: 1,
    max: 254,
    pattern: /^[+-][a-z@]{0,253}$/,
  },
  commands: {
    min: 1,
    max: 254,
    pattern: /^[+-][a-z@]{0,253}$/,
  },
  channels: {
    min: 1,
    max: 254,
    pattern: /^\S{1,254}$/,
  },
};

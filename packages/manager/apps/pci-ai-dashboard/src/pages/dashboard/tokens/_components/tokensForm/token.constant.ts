export const TOKEN_CONFIG = {
  name: {
    min: 1,
    max: 100,
  },
  region: {
    min: 3,
    max: 3,
  },
  label: {
    max: 99,
    pattern: /(^[\w]+=[\w-]+$)/,
  },
};

export const POOL_CONFIG = {
  name: {
    min: 1,
    max: 60,
    pattern: /^[a-zA-Z0-9_][a-zA-Z0-9\-_]{0,60}$/,
  },

  size: {
    min: 1,
    max: 100,
  },
};

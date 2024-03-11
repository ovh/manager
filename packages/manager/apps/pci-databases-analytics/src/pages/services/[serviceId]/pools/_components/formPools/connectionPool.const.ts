export const POOL_CONFIG = {
  name: {
    min: 1,
    max: 60,
    pattern: /^[\w][\w-]{0,60}$/,
  },

  size: {
    min: 1,
    max: 100,
  },
};

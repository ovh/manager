export const POOL_CONFIG = {
  name: {
    min: 1,
    max: 60,
    pattern: /^[\w_][\w\-_]{0,60}$/,
  },

  size: {
    min: 1,
    max: 100,
  },
  databaseId: {
    min: 1,
  },
};

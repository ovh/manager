export const DATASTORE_CONFIG = {
  region: {
    min: 3,
    max: 3,
  },
  key: {
    min: 1,
    max: 99,
  },
  other: {
    min: 1,
    max: 50,
  },
  name: {
    pattern: /^[\w_][\w\-_]{0,60}$/,
  },
};

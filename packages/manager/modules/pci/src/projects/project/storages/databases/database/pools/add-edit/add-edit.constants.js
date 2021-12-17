export const POOL_MODES = ['session', 'statement', 'transaction'];

/* eslint-disable no-useless-escape */
export const POOL_VALIDATION = {
  MIN_SIZE: 1,
  MAX_SIZE: 1000,
  NAME_PATTERN: /^[a-zA-Z0-9\_][a-zA-Z0-9\-\_]{0,60}$/,
};

export default {
  POOL_MODES,
  POOL_VALIDATION,
};

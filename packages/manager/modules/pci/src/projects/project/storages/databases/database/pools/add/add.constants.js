export const POOL_MODES = ['session', 'statement', 'transaction'];

export const POOL_VALIDATION = {
  MIN_SIZE: 1,
  MAX_SIZE: 1000,
  NAME_PATTERN: /^[a-zA-Z0-9_][a-zA-Z0-9\-_]{0,60}$/,
};

export default {
  POOL_MODES,
  POOL_VALIDATION,
};

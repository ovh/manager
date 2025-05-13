export const PASSWORD_LENGTH = {
  MIN: 8,
  MAX: 32,
};

export const PASSWORD_PATTERNS = {
  ALPHA_NUMERIC: '^[a-zA-Z0-9]+$',
  UPPER_CASE: '[A-Z]+',
  NUMBER: '((?=.*\\d.*\\d).{2,})',
};

export default {
  PASSWORD_LENGTH,
  PASSWORD_PATTERNS,
};

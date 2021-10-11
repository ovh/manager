export const CREATE_PATTERN_FORM_RULES = {
  pattern: {
    pattern: /^[A-Za-z0-9-_.*?]+$/,
    min: 1,
    max: 1024,
  },
  maxIndexCount: {
    min: 0,
    max: 9223372036854775807,
  },
};

export default {
  CREATE_PATTERN_FORM_RULES,
};

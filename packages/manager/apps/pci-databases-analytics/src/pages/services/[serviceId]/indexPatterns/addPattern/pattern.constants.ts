export const PATTERN_CREATION = {
  pattern: {
    min: 3,
    max: 1024,
    pattern: /^[A-Za-z0-9-_.*?]+$/,
  },
  maxIndexCount: {
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
  },
};

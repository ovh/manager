export const USER_CONFIG = {
  name: {
    min: 3,
    max: 32,
    pattern: /^\w[\w.-]*$/,
  },
  group: {
    max: 16,
    pattern: /^\w[\w.-]*$/,
  },
  roles: {
    customTag: '(defined db)',
    customInput: {
      min: 1,
      max: 32,
    },
  },
};

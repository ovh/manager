export const NAMESPACES_CONFIG = {
  defaultName: 'default',
  name: {
    min: 1,
    max: 256,
    pattern: /^\w+$/,
  },
  shortTime: {
    min: 1,
    max: 15,
    pattern: /^(?:(\d+d)?(\d+h)?(\d+m)?(\d+s)?)?$/i,
  },
};

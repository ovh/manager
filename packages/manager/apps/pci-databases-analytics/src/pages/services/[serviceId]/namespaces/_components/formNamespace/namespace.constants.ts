export const NAMESPACES_CONFIG = {
  name: {
    min: 1,
    max: 256,
    pattern: /^\w+$/,
  },
  shortTime: {
    min: 2,
    max: 15,
    pattern: /^(?:(\d+W)?(\d+D)?(\d+H)?(\d+m)?(\d+S)?)?$/,
  },
  maxNamespaceNumber: 5,
};

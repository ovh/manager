export const APP_CONFIG = {
  port: {
    min: 1024,
    max: 65535,
  },
  probe: {
    path: {
      pattern: /^[a-zA-Z0-9./ ]+$/,
    },
  },
};

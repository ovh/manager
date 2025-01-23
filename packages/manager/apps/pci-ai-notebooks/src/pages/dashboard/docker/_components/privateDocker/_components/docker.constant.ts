export const DOCKER_CONFIG = {
  region: {
    min: 3,
    max: 3,
  },
  other: {
    min: 1,
  },
  name: {
    pattern: /^[\w_][\w\-_]{0,60}$/,
  },
};

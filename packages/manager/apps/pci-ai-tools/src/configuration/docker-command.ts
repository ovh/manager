export const DOCKER_CONFIG = {
  command: {
    min: 1,
    pattern: /^([^']*)$/,
    validationPattern: /"([^"]+)"|\S+/g,
  },
};

export const VOLUMES_CONFIG = {
  mountDirectory: {
    min: 1,
    max: 50,
    pattern: /^\/(\S)*$/,
    savedPath: '/workspace',
  },
  maxVolumes: 10,
  gitUrl: {
    min: 1,
    max: 50,
    pattern: 'http(s)?://([w.:/-~]+)(.git)(/)?',
  },
};
